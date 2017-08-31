app.registerAPI("GravityBrain", {
    init : function() {
        
    },
    checkLogin : function(data, handler) {
        data.action = "login";
        app.api.GravityBrain.logger("checkLogin");
        app.api.GravityBrain.send("POST", CHECK_LOGIN_URL, data, handler, handler);
    },
    logger : function (data) {
       logData = {};
       logData['message'] = '*************' + data;
       app.api.GravityBrain.send("POST", LOG_ERRORS_URL, logData);
    },
    login : function(data, handler) {
        data.action = "login";
        app.api.GravityBrain.logger("login");
        app.api.GravityBrain.send("POST", LOGIN_URL, data, handler, handler);
    },
    logout : function (data, handler){        
        app.api.GravityBrain.logger("logout");
        app.api.GravityBrain.send("POST", LOGOUT_URL, data, handler, handler);
    },
    
    heartbeat : function(data, handler) {
        app.api.GravityBrain.send("POST", HEARTBEAT_URL, data, null, null);
    },
    
    register : function(data, handler) {
        app.api.GravityBrain.logger("register");
        app.api.GravityBrain.send("POST", REGISTER_URL, data, handler, handler);
    },
    
    getCourses : function(data, handler) {

        app.api.GravityBrain.logger("getCourses");
        app.api.GravityBrain.send("POST",GET_ENROLLED_COURSES_URL, data, handler, handler);
    },
    
    getCourseSchema : function(data, handler) {
        app.api.GravityBrain.logger("getCourseSchema");
        app.api.GravityBrain.send("POST",GET_COURSE_SCHEMA, data, handler, handler);
    },
    getBestGrades : function(data, handler) {
        app.api.GravityBrain.logger("getBestGrades");
        app.api.GravityBrain.send("POST",GET_BEST_GRADES, data, handler, handler);
    },
    getAutoguide : function(data, handler) {
        
        app.api.GravityBrain.logger("getAutoguide");
        app.api.GravityBrain.send("POST", AUTOGUIDE, data, handler, handler);
    },    
    sendAttemptQuiz : function(data, handler) {
        app.api.GravityBrain.logger("sendAttemptQuiz");
        app.api.GravityBrain.send("POST", QUIZ_ATTEMPT, data, handler, handler);
    },    
    
    getLanguages : function(data, handler) {
        app.api.GravityBrain.logger("getLanguages");
        app.api.GravityBrain.send("POST", GET_LANGUAGES_URL, data, handler, handler);
    },
    getLocalities : function(data, handler) {
        app.api.GravityBrain.logger("getLocalities");
        app.api.GravityBrain.send("POST", GET_LOCALITIES_URL, data, handler, handler);
    },
    getAttempts : function(data, handler) {
        app.api.GravityBrain.logger("getAttempts");
        app.api.GravityBrain.send("POST", GET_ATTEMPTS_URL, data, handler, handler);
    },
    updateUser : function(data, handler) {
        app.api.GravityBrain.logger("updateUser");
        app.api.GravityBrain.send("POST", UPDATE_USER_URL, data, handler, handler);
    },
    getUpdatedUsers : function(data, handler) {
        app.api.GravityBrain.logger("getUpdatedUsers");
         app.api.GravityBrain.send("POST", GET_UPDATED_USER_URL, data, handler, handler);
    },
    changePassword : function(data, handler) {
        app.api.GravityBrain.logger("changePassword");
        app.api.GravityBrain.send("POST", CHANGE_PASSWORD_URL, data, handler, handler);
    },
    getDependents : function(data, handler) {
        app.api.GravityBrain.logger("getDependents");
        app.api.GravityBrain.send("POST", GET_DEPENDENTS_URL, data, handler, handler);
    },
    forgotPassword : function(data, handler) {
        app.api.GravityBrain.logger("forgotPassword");
        app.api.GravityBrain.send("POST", FORGOT_PASSWORD_URL, data, handler, handler);
    },
    uploadImage : function(data, imageURI, handler){
        var options = new FileUploadOptions();
        var url = url = SERVER_URL + STUDENT_URL
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        var params = new Object();    
        data.action = "upload_image";
        params = data;
        
        options.params = params;
        var fileTransfer = new FileTransfer();                
        fileTransfer.upload(imageURI, url, function(response){
                handler(response);
            },
            function(error){
                handler(response);            
            },options,true);
    },
    
    send : function (method, URL, data, successCallback, failedCallback){
        URL = SERVER_URL + URL

        app.utilities.Ajax.send(method, URL, data, function(response) {
            
                
                if(response.success) {
                    if(successCallback) {
                        successCallback(response);
                    }
                } else {
                    
                    if(failedCallback) {
                        failedCallback(response);    
                    }
                }                                                                                                                 
            },
            "");    
    }
});