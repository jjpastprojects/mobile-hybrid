app.registerUtility("Security", {
    token : "",
    loggedIn : false,
    username : '',
    password : "",
    getToken : function () {
        var deviceId = device.uuid;
        var cordova = device.cordova;
        var platform = device.platform;
        var version = device.version;
        var data = {"uuid" : deviceId, "cordova" : cordova, "platform" : platform, "version" : version};
       
        app.ajax.get("/Users/getToken",data,app.security.setToken,"");
    },
    setToken : function (token) {
        app.security.token = response.token;                    
        app.ajax.handleResponse(response);
    },
    checkLogin : function() {
        
        app.api.GravityBrain.checkLogin({}, app.utilities.Security.checkLoginHandler);
    },
    checkLoginHandler : function(response) {
        app.utilities.Templates.load("top_menu", "top_menu",{});
        if(response.success) {
             app.utilities.Security.token = response.data.user.auth_token;
             app.utilities.Security.username = response.data.user.username;
            
             app.sections.Login.loginHandler(response);
        } else {
            app.sections.Login.load(); 
        }
    },
    login : function(login, password) {
        if (app.utilities.Connection.check()) {    
            data = {};
            data['username'] = login
            data['password'] = password;
            app.utilities.Security.username = login;
            app.utilities.Security.password = data['password'];
            
            /*navigator.geolocation.getCurrentPosition(function(position) {
                data['position'] = JSON.stringify(position);
                app.ajax.get("",data,"");
            },
            function() {
                app.ajax.get("",data,"");
            });*/
            
            app.api.GravityBrain.login(data, app.utilities.Security.loginHandler);
            
        } else {
            alert("There is no current connection to .");
        }
    },
    loginHandler : function(response) {
        if(response.success) {
            if(response.data.user.auth_token) {
                app.utilities.Security.token = response.data.user.auth_token;
                app.utilities.Security.username = response.data.user.username;    
            } 
        }
            app.sections.Login.loginHandler(response);
        
    },    
    oneClickLogin : function(username) {
        var data = app.classes.GravityBrainUser.getOneClickUser(username);
        app.utilities.Security.username = username;
        app.utilities.Security.password = data['password'];
        app.api.GravityBrain.login(data, app.utilities.Security.loginHandler);
        
        
    },
    register : function(username, password, email) {
        var data = {"username" : username, "password" : password, "email" : email};
        app.api.GravityBrain.register(data, null);
    },
    clearTimouts : function() {
        app.sections.Dashboard.clearTimeouts();
        app.sections.Events.clearTimeouts();
    },
    logout : function() {
        app.utilities.Security.token = "";
        app.api.GravityBrain.logout({}, null);
        app.utilities.Security.username = "";
        app.utilities.Security.password = "";
        app.sections.LoginloginInProgress = false;
        app.sections.Login.rememberMe = false;
        app.sections.Login.oneClickLogin = false;
        
        if(app.heartBeatInterval) {
            clearInterval(app.heartBeatInterval);
        }
        app.utilities.Languages.initCallback = app.utilities.Security.checkLogin;
        app.sections.Login.load();
        
    },
    logoutHandler : function(response) {
        if(response.success){
            app.sections.Login.load();    
        }
    }
});