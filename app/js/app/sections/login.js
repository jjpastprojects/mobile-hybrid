app.registerSection("Login", {
    shakeCounter : 0,
    shakeInterval : false,
    loginInProgress : false,
    rememberMe : false,
    oneClickLogin : false,
    load : function() {
        
        if(!app.utilities.Connection.check()) {
            app.utilities.Templates.load("no_connection", "main", {});
            $("#retry_connection").unbind(CLICK_EVENT).on(CLICK_EVENT,  function() {
              
                    app.start();
                    return false;
                });
           return;   
        }
        
        var data = {}
        $("#languages_container").show();
        app.utilities.Templates.load("login", "main", {"languages" : app.utilities.Languages.languageList, "link" : BZABC_URL});
        
        if(IS_IOS) {
            app.utilities.Templates.load("question_mark", "ios_question_mark_container", {});
            $("#question_mark_ios").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                    $("#question_mark_pop_up").toggle();
                    return false;
                });
        }
        
        app.sections.Login.initLoginForm();         
        
        var viewport = {
            width: $(window).width(),
            height: $(window).height()
        };
                    
        var container = $('#login_container');
                    
        if (container && container.length) {
            container.height(viewport.height);
        }
        $("#top_menu").show();
        $("#logout_button").hide();
        if(!IS_IOS) {
            $("#for_parents_container").show();
            app.utilities.Templates.load("for_parents", "for_parents_container", {"languages" : app.utilities.Languages.languageList, "link" : BZABC_URL});
        }
    },
    
    initLoginForm : function() {
        var form = "#login_form";
        app.utilities.Form.apply(form);
        
        app.sections.Login.updateOneClickUsers();
        
        $(form).submit(function(e) {
            if(!app.sections.Login.loginInProgress){
                app.sections.Login.loginInProgress = true;
                e.preventDefault();
                var check = true;
                if($("#username").val() == "") {
                    $("#username").addClass("form_error");
                    //app.utilities.Messages.showMessage("Username required");    
                    check = false;
                }
                if($("#password").val() == "") {
                    $("#password").addClass("form_error");
                    //app.utilities.Messages.showMessage("Password required");    
                    check = false;
                }
                if(check) {
                    if($("#remember_me").is(":checked")) {
                        
                        app.sections.Login.rememberMe = true;    
                    }
                    app.utilities.Security.login($("#username").val(),  $("#password").val());
                } else {
                    app.sections.Login.loginInProgress = false;    
                }
            }
            return false;
        });
        
        $("#forgot_password_link").unbind(CLICK_EVENT).on(CLICK_EVENT, function(e) {
                e.preventDefault();
                app.utilities.Templates.load("forgot_password", "main", {"languages" : app.utilities.Languages.languageList});
                app.sections.Login.initForgotPassword();
                return false;
            });
    },
    initForgotPassword : function() {
        $("#forgot_password_cancel").unbind(CLICK_EVENT).on(CLICK_EVENT, function(e) {
                e.preventDefault();
                app.sections.Login.load();
                return false;
            });
        var form = "#forgot_password";    
        $(form).submit(function(e) {
            if(!app.sections.Login.loginInProgress){
                app.sections.Login.loginInProgress = true;
                e.preventDefault();
                var check = true;
                if($("#email").val() == "") {
                    $("#email").addClass("form_error");
                    //app.utilities.Messages.showMessage("Username required");    
                    check = false;
                }
                if(check) {
                    app.api.GravityBrain.forgotPassword({email : $("#email").val()}, app.sections.Login.forgotPasswordHandler);
                } else {
                    app.sections.Login.loginInProgress = false;    
                }
            }
            return false;
        });
    },
    forgotPasswordHandler : function(response) {
        if(response.success) {
            app.utilities.Messages.showMessage(app.utilities.Languages.getValue("ForgotPasswordPopup", "success"));
            app.sections.Login.load();        
        } else {
            app.utilities.Messages.showMessage(app.utilities.Languages.getValue("ForgotPasswordPopup", "failed")); 
            $("#email").addClass("form_error");
            
        }
    },
    loadOneClickUsers : function() {
        
        var oneClickUsers = app.utilities.Storage.get("one_click_users");    
        for(user in oneClickUsers) {
           app.classes.GravityBrainUser.setDefaultAvatar(oneClickUsers[user]);
            $("#one_click_login_users_container").append(app.utilities.Templates.retrieve("one_click_login_user", oneClickUsers[user]));    
        }
        app.sections.Login.initOneClickLogins();
    },
    initOneClickLogins : function() {
        $(".one_click_login_user").unbind(CLICK_EVENT).on(CLICK_EVENT,function() {
                app.sections.Login.oneClickLogin = true;
                var username = $(this).data("username");
                
                app.utilities.Security.oneClickLogin(username);
            });
    },
    updateOneClickUsers : function() {
        
        var oneClickUsers = app.utilities.Storage.get("one_click_users");
        var userIds = [];
        var counter = 0;
        for(user in oneClickUsers) {
            userIds[counter] = oneClickUsers[user].user_id;
            counter++;
        }
        var data = {"user_ids" : userIds};
        app.api.GravityBrain.getUpdatedUsers(data, app.sections.Login.updateOneClickUserHandler); 
         
        
    },
    updateOneClickUserHandler : function(response) {
        
        if(response.success) {
            for(var x in response.data.users) {
                app.classes.GravityBrainUser.updateUser(response.data.users[x]); 
            }
        }
        
        app.sections.Login.loadOneClickUsers();        
    },
    loginHandler : function(response) {
        
        if(response.success){
            app.sections.Login.loginSuccess(response);    
        } else {
            app.sections.Login.loginFailed(response);
        }
        app.sections.Login.loginInProgress = false;
    },
    
    loginSuccess : function (response) {
        app.utilities.Security.loggedIn = true;
        
        
        //check for stored quizzes
        app.classes.QuizStorage.sendStoredQuizzes();
           
        //app.utilities.Messages.showMessage("Login Succesful.");        

        
        if(!app.sections.Login.oneClickLogin && app.sections.Login.rememberMe) {
            app.classes.GravityBrainUser.setOneClickUser(response.data.user);            
        }
        app.classes.GravityBrainUser.set(response.data.user);
        app.sections.Login.loadDependents();
        app.api.GravityBrain.heartbeat({}, null);
        app.heartBeatInterval = setInterval(function(){app.api.GravityBrain.heartbeat({}, null);}, 60000);
        
        if(response.data.user['usr_langauge'] != app.utilities.Languages.currentLanguage) {
            
            app.utilities.Languages.changeLanguage(response.data.user['usr_language'], app.sections.Dashboard.load)   
        } else {
        
            app.sections.Dashboard.load();
        }
        
    },
    loadDependents : function() {
        app.api.GravityBrain.getDependents({}, app.sections.Login.loadDependentsHandler);
    },
    loadDependentsHandler : function(response) {
        if(response.success) {
            if(response.data.dependents) {
                for(x in response.data.dependents) {
                    app.classes.GravityBrainUser.setOneClickUser(response.data.dependents[x]);        
                }
            }
        }
    },
    loginFailed : function(response) {
        app.utilities.Messages.showMessage(response.messages.error['logged_in']);
        $("#password").val("");
        app.sections.Login.shakeInterval = setInterval(app.sections.Login.shakeInputs, 10);   
        
    },
    shakeInputs : function() {
        var shake= 3;
        if(app.sections.Login.shakeCounter < 100) {
            $(".login_input").stop(true,false)
            .css({position: 'relative', 
            left: Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px', 
            top: Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px'
            });    
            app.sections.Login.shakeCounter++;
        } else {
            clearInterval(app.sections.Login.shakeInterval);
            $(".login_input").stop(true,false)
                .css({position: 'static', left: '0px', top: '0px'});
            app.sections.Login.shakeCounter = 0;
        }
    }
                
});