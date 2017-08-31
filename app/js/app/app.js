// JavaScript Document
(function () {
    function App() {}
    App.extend = function (base) {
        var i, j, ext;
        base = base || {};
        for (i = 1; i < arguments.length; i++) {
            ext = arguments[i];
            if (ext) {
                for (j in ext) {
                    if (ext.hasOwnProperty(j)) {
                        base[j] = ext[j];
                    }
                }
            }
        }
        return base;
    };
    
    App.concat = function () {
        var array = [], x, y;
        for (x=0; x<arguments.length; x++) {
            for (y=0; y<arguments[x].length; y++) {
                array.push(arguments[x][y]);
            }
        }
        return array;
    };
    
    App.prototype.extend = function () {
        this.constructor.extend.apply(this, this.constructor.concat([this], arguments));
        return this;
    };
    
    App.extend(App.prototype, {
        log : function (message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        },
        logs : function(message) {
            
                if (window.console && window.console.log) {
                window.console.log(JSON.stringify(message));
            }
        }
    });
    
    this.app = new App ();
    App = null;
}());

app.extend({
    heartBeatInterval : null,
    api : {},
    utilities : {},
    sections : {},
    classes : {},
    button : null,
   
    // Start the app here. Must wait for asynchronous templates to load and store. 
    start : function() {

        // Need to disable default behaviour of touch move events to allow us to be able to use swipe events effectly and not be interfered with by DOM scrolling.
        
        // Check if all the temlates from template_list.js have loaded into memory.
      
        
        if(!app.utilities.Templates.areTemplatesLoaded) {
            app.log("templates not ready yet");
            // If templates not loaded, we will try again in a bit.
            setTimeout("app.start()", 100);             
            return;
        }
        app.initOpenExternalURL();
        app.preventDefaultTouchMove();
        
        //try to disable right click
        app.disableRightClick();
        // If we got here, templates loaded.
        app.log('templates ready');
        // Begin login procedure.
        
        if(!app.utilities.Connection.check()) {
            app.utilities.Templates.load("no_connection", "main", {});
            $("#retry_connection").unbind(CLICK_EVENT).on(CLICK_EVENT,  function() {
              
                    app.start();
                    return false;
                });
           return;   
        }
        
       
        app.utilities.Languages.initLanguages(app.utilities.Security.checkLogin);
        
    },
    initOpenExternalURL : function() {
        $(document).on(CLICK_EVENT,".external_url", function(e) {
            e.preventDefault();
            var url = $(this).attr("href");
            
            if(navigator.app ) {
              
                navigator.app.loadUrl(url, { openExternal:true });
            } else {
                  
                if(typeof Ti !== 'undefined') {
                    Ti.Platform.openURL(encodeURI(url));    
                } else {                  
                    window.open(encodeURI(url), "_system");    
                }
            }
            return false;
        });
    },
    disableRightClick : function() {
       
       /* $(document).on(CLICK_EVENT,"*", function(event) {
            alert(event.button);
                if (event.button == 2){
                    
                    e.preventDefault();
                    return false;
                }


            });*/
    },
    
    preventDefaultTouchMove : function() {
        // preventing default events on touch move
        $(document).bind("touchmove", function(e){
                //still want scrolling in certain areas so we will allow DOM objects with class scrollable to be scrollable        
                if((!$(e.target).hasClass("scrollable") && !$(e.target).closest('.scrollable').length > 0)){
                    e.preventDefault();
                }
            });
        
        
    },
    checkPopUp : function(e) {
        if(!$(e.target).hasClass("pop_up") && !$(e.target).closest('.pop_up').length > 0){
            return false;    
        }
        return true;
    },
    
           
    init : function() {
        var i;
        //init utilities
        for (i in app.utilities) {
            app.log("init-utility-" + i);
            if (app.utilities.hasOwnProperty(i)) {
                if (app.utilities[i].init) {
                    app.utilities[i].init();
                }
            }
        }
        
        // init sections
        for (i in app.sections) {
            app.log("init-section-" + i);
            if (app.sections.hasOwnProperty(i)) {
                if (app.sections[i].init) {
                    app.sections[i].init();
                }
            }
        }
        
        // init sections
        for (i in app.classes) {
            app.log("init-class-" + i);
            if (app.classes.hasOwnProperty(i)) {
                if (app.classes[i].init) {
                    app.classes[i].init();
                }
            }
        }
        
        // init api
        for (i in app.api) {
            app.log("init-api-" + i);
            if (app.api.hasOwnProperty(i)) {
                if (app.api[i].init) {
                    app.api[i].init();
                }
            }
        }
        
        app.log("app init finished");
        app.start();
    },
    
    addScrolling : function(id) {
        $("#" + id).find('.scrollable').bind('touchmove', function(e){
          e.stopPropagation();
        });
    },
    
    htmlEntities : function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
        
    registerUtility : function(name, object) {
        app.utilities[name] = object;
    },
    
    
    registerSection : function(name, object) {
        app.sections[name] = object;
    },
    
    registerClass : function(name, object) {
        app.classes[name] = object;
    },
    
    registerAPI : function(name, object) {
        app.api[name] = object;
    },
       
        
    
    
    
});
