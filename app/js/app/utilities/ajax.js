app.registerUtility("Ajax", {
        lastNoConnectionMessage : 0,
        noConnectionMessageDelay : (30 * 1000),
        
        loadLocal : function (url, templateName,  callback) {
            
            var xmlhttp = new XMLHttpRequest();
            
            
            // Callback function when XMLHttpRequest is ready
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 ) {    
                    if(callback) {
                        callback(xmlhttp.responseText, templateName);    
                    }
                }
            };
            
            //app.log("load local url " + url);
            xmlhttp.open("GET", url , true);
            xmlhttp.send();
            
        },
        
        send : function (method, url, data, responseFunction, contentType) {
            
            //app.log("calling url " + url);
            if(!data) {
                data = {};
            }
            if (!contentType) {
                contentType = 'application/x-www-form-urlencoded';
            }
            if(app.utilities.Security.token) {
                data['auth_token'] = app.utilities.Security.token;    
            }
            if(app.utilities.Security.username) {
                data['username'] = app.utilities.Security.username;    
            }

            data['json'] = true;
            if(app.utilities.Connection.check()) {
                //app.log("data sent=");
                //app.log(data);
                $.ajax({
                    type: method,
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': contentType
                    },
                    success: function (response, textStatus, jqXHR) {
                        //app.log("server response=");
                        //app.log(response);
                        
                        if(responseFunction) {
                            responseFunction(response);                      
                        } else {
                            //app.ajax.handleResponse(response);
                        }
                    },
                    dataType: 'json'
                });
            } else {
                var time = new Date().getTime();
                if(app.utilities.Ajax.lastNoConnectionMessage == 0 || ((time - app.utilities.Ajax.lastNoConnectionMessage) > app.utilities.Ajax.noConnectionMessageDelay)) {
                    alert("No connection available, please try again when connection is available");                    app.utilities.Ajax.lastNoConnectionMessage = time;
                }
            }    
        },
        
            
        getOrQueue :function (url, data, responseFunction) {
            var new_url = app.config.data['home_url'] + url;
            if(!data) {
                data = {};    
            }
            
            if(app.utilities.Connection.check() && !app.config.data['capture_only']) {
                if(app.utilities.Security.token != "") {
                    
                    data['token'] = app.utilities.Security.token;    
                }
                $.post(new_url,data, function (response) {                   
                        if(responseFunction != "") {
                            responseFunction(response);                      
                        } else {
                            app.ajax.handleResponse(response);
                        }
                    },
                    "json"
                    );
                return true;
            } else {
                var queueStorage = {};
                queueStorage['url'] = url;
                queueStorage['data'] = data;
                queueStorage['responseFunction'] = responseFunction;
                app.utilities.storage.store(getQueueCounterName(queueCounter), queueStorage);
                queueCounter++;
                app.utilities.storage.store("queueCounter", queueCounter);
                clearTimeout(ajax_queue_timeout);
                app.config.increaseUnsentMessages();
                if(!app.config.data['capture_only']) {
                    ajax_queue_timeout = setTimeout("app.ajax.checkQueued();", 10000);
                }
                return false;
            }
        },
        checkQueued : function() {
            if(app.utilities.Connection.check()) {
                for(var i = 0; i <= queueCounter; i++) {
                    app.log("queueCounter " + i);
                    var store = app.utilities.storage.get(getQueueCounterName(i));
                    app.log(store);
                    if(store['url']) {
                        
                        store['data']['is_queued'] = 1;
                        
                        app.ajax.getOrQueue(store['url'], store['data'], store['responseFunction']);
                        app.utilities.storage.remove(getQueueCounterName(i));
                        app.config.decreaseUnsentMessages();
                        break;
                    }
                }
            } else {
                clearTimeout(ajax_queue_timeout);
                ajax_queue_timeout = setTimeout("app.ajax.checkQueued();", 10000);
            }
        },
        checkForQueued : function() {
            for(var i = 0; i <= queueCounter; i++) {
                var store = app.utilities.storage.get(getQueueCounterName(i));
                if(store['url']) {
                    return true;
                }
            }
        },
        processQueued : function() {
            
            if(!app.utilities.Connection.check()) {
                alert("No connection available, please try to reconnect to the network.");    
                return false;
            }
            
            if(app.utilities.Connection.check()) {
                app.config.data['capture_only'] = false;
                for(var i = 0; i <= queueCounter; i++) {
                    app.log("queueCounter " + i);
                    var store = app.utilities.storage.get(getQueueCounterName(i));
                    app.log(store);
                    if(store['url']) {
                        
                        store['data']['is_queued'] = 1;
                        app.ajax.getOrQueue(store['url'], store['data'], store['responseFunction']);
                        app.utilities.storage.remove(getQueueCounterName(i));
                        app.config.decreaseUnsentMessages();
                        
                    }
                }
                app.config.data['capture_only'] = true;
            } else {
                clearTimeout(ajax_queue_timeout);
                ajax_queue_timeout = setTimeout("app.ajax.processQueued();", 10000);
            }
        },
        checkQueueForReset : function() {
            for(var i = 0; i <= queueCounter; i++) {
                var store = app.utilities.storage.get(getQueueCounterName(i));
                var checkQueue = false;
                if(store['url']) {
                    checkQueue = true;
                }
            }
            if(checkQueue == false) {
                queueCounter = 0;
                app.utilities.storage.store("queueCounter", queueCounter);    
            }
                
        },
                                                    
        
    
        
        handleResponse : function (response) {
            whichDiv='';
            no_main_add=false;
            var changedDivs = new Array();
            //app.log("handleResponse");
            //app.log(response);
            
        },
                
    });