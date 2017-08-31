// JavaScript Document// JavaScript Document

app.registerUtility("Languages", {
    languageList : null,
    localities : {},
    currentLanguage : null,
    initCallback : null,
    callback : null,
    
    askForLanguage : function() {
        var html = app.utilities.Templates.load("pop_up_languages", "languages_container", {"languages" : app.utilities.Languages.languageList});
        
        
         app.utilities.Languages.initAskForLanguage();
         //app.utilities.PopUp.showWithHTML({"html" : html, "width" : 300, "height" : 550, "closeable" : false, "callback" :app.utilities.Languages.initAskForLanguage});
         
         
    },
    initAskForLanguage : function() {
       app.utilities.Languages.initLanguageOptions();
    },
    
    initLanguageOptions : function() {
        $(document).on(CLICK_EVENT,".language_select", function() {
            var language = $(this).data("value");
            
            app.utilities.Languages.setCurrentLanguage(language); 
            //app.utilities.PopUp.close();
            
            app.utilities.Languages.getLocalities();
            return false;
            
        });
        
    },
    
    changeLanguage : function(language, callback) {
        if(callback) {
             app.utilities.Languages.initCallback = callback;            
        } else {
             app.utilities.Languages.initCallback = null;       
        }
        app.utilities.Languages.setCurrentLanguage(language);
        app.utilities.Cookies.save("language", language);
        app.utilities.Languages.getLocalities();
    },    
    initLanguages : function(callback) {
        if(callback) {
            app.utilities.Languages.initCallback = callback;    
        }
        app.utilities.Languages.getLanguages();
        
        
    },
    setCurrentLanguage : function(language) {
        app.utilities.Languages.currentLanguage = language;
        
        app.utilities.Cookies.save("language", language);
    },
    getLanguages : function() {
        app.api.GravityBrain.getLanguages({}, app.utilities.Languages.getLanguagesHandler);
    },
    getLanguagesHandler : function(response) {
        app.utilities.Languages.languageList = response.data.languages_list;
        
        //if(!IS_MOBILE) {
        var html = app.utilities.Templates.load("pop_up_languages", "languages_container", {"languages" : app.utilities.Languages.languageList});    
        app.utilities.Languages.initLanguageOptions();
        if(app.utilities.Cookies.get("language") != "undefined" && app.utilities.Cookies.get("language") != "") {
        
            app.utilities.Languages.currentLanguage = app.utilities.Cookies.get("language"); 
            
        } else {
              app.utilities.Languages.setCurrentLanguage(DEFAULT_LANGUAGE_CODE);
        }
        
        app.utilities.Languages.getLocalities();
        
    },
    getLocalities : function() {
        
        if(!app.utilities.Languages.currentLanguage) {
            app.utilities.Languages.currentLanguage = DEFAULT_LANGUAGE_CODE;
        }
        
        app.api.GravityBrain.getLocalities({"language" : app.utilities.Languages.currentLanguage}, app.utilities.Languages.getLocalitiesHandler);
    },
    getLocalitiesHandler : function(response) {
        
        app.utilities.Languages.localities[app.utilities.Languages.currentLanguage] = response.data.localities;
        if(app.utilities.Languages.initCallback) {
            app.utilities.Languages.initCallback();
        }
    },
    getCurrentLocality : function() {
        if(app.utilities.Languages.currentLanguage) {
            return app.utilities.Languages.localities[app.utilities.Languages.currentLanguage];    
        } else {
               
        }
    },
    getValue : function(category, name) {        
        if(app.utilities.Languages.localities[app.utilities.Languages.currentLanguage][category] && app.utilities.Languages.localities[app.utilities.Languages.currentLanguage][category][name]) {
            
            return app.utilities.Languages.localities[app.utilities.Languages.currentLanguage][category][name];
        }
    }
                    
});