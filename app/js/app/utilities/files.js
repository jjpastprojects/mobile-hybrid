app.registerUtility("Files", {
        fileSystem : null,
        fullPath : null,
        rootDirectory : ".bzabc_courses",
        tideSDKRootDirectory : null,
        directoryEntry : null,
        soundList : [],
        videoList : [],
        imageList : [],
        fileList : {},
        fileListCheck : {},
        callback : null,
        checkTransfersTimeout : null,
        preloadAudio : [],
        preloadImages : [],
        checkIfPreloadDoneTimeout : null,
        init : function() {
            if(IS_MOBILE) {
                app.utilities.Files.getFileSystem();    
            }         },
        getFileSystem : function (success) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.utilities.Files.getFileSystemSuccess, app.utilities.Files.failedToGetFs);
            
        },
        getFileSystemSuccess : function(fileSystem) {
            app.utilities.Files.fileSystem = fileSystem;       
            app.utilities.Files.createDirectoryInit(app.utilities.Files.rootDirectory);
        },
        createDirectoryStructure : function (fileSystem) {
            app.utilities.Files.fileSystem = fileSystem;
        },
        failedToGetFs : function (evt) {
            alert("file sytem get failed = " + evt.target.error.code);    
        },
        createDirectoryInit : function (directory) {
            var newDirectory = directory;
            app.utilities.Files.fullPath = app.utilities.Files.fileSystem.root.fullPath;
           
            app.utilities.Files.fileSystem.root.getDirectory(newDirectory, {create : true}, function (directoryEntry) {
                    //app.utilities.Files.tmpDirectoryEntry     = directoryEntry;    
                    app.utilities.Files.directoryEntry = directoryEntry; 
                },
                function (error) {
                    alert('directory=' + newDirectory + " creation failed error=" + error);
                }                   
            );                                                                        
        },
        
        moveFile : function (to, from) {
            entry = new FileEntry({fullPath : from});
        },
        moveToTmp : function (path) {
            app.log("camera image path: " + path);
            var confirmation_type = type;
            window.resolveLocalFileSystemURI( path, function (fileEntry) {
                imageURITemp = fileEntry.toURL();
                fileNameTemp = "";
                fileEntry.moveTo(app.utilities.Files.tmpDirectoryEntry, fileNameTemp, function (newFileEntry) {},function (error) {
                    app.log("failed to get image file: " + error);    
                });        
            });            
        },
        preloadLesson : function(data, callback) {
            app.utilities.Files.callback = callback;
            if(data.sounds) {
                for (var x in data.sounds) {
                    if(data.sounds[x]) {
                        
                        app.utilities.Files.fileListCheck[data.sounds[x]] = false;
                        
                        app.utilities.Files.preloadAudio[data.sounds[x]] =  new Audio(data.sounds[x]);
                        app.utilities.Files.preloadAudio[data.sounds[x]].preload = "auto";
                    }
                    
                }
            }
            
            if(data.images) {
                for (var x in data.images) {
                    if(data.images[x]) {

                        app.utilities.Files.fileListCheck[data.images[x]] = false;
                        app.utilities.Files.preloadImages[data.images[x]] =  new Image();
                        app.utilities.Files.preloadImages[data.images[x]].src = data.images[x];
                        app.utilities.Files.preloadImages[data.images[x]].alt = data.images[x];
                        app.utilities.Files.preloadImages[data.images[x]].onload = function() {

                            app.utilities.Files.fileListCheck[this.alt] = true;
                        }
                    }
                }
            }

            app.utilities.Files.checkIfPreloadDone();
            
        },
        checkIfPreloadDone : function() {
            var check = true;
            if(app.utilities.Files.preloadAudio) {

                for(var x in app.utilities.Files.preloadAudio) {
                    if(app.utilities.Files.preloadAudio[x].readyState == 4) {
                        app.utilities.Files.fileListCheck[app.utilities.Files.preloadAudio[x].src] = true;
                        
                    } else {
                        check = false;
                    }
                }
            }
            
            if(app.utilities.Files.preloadImages) {
                for(var x in app.utilities.Files.preloadImages) {
                    if(app.utilities.Files.fileListCheck[x] != true) {
                        check = false;
                    }
                }
            }

            
            if(check == true) {
                clearTimeout(app.utilities.Files.checkIfPreloadDoneTimeout);
                if(app.utilities.Files.callback) {
                   
                    app.utilities.Files.callback();
                }
            } else {
                app.utilities.Files.checkIfPreloadDoneTimeout = setTimeout(function(){app.utilities.Files.checkIfPreloadDone();}, 2000);    
            }
            
            
            
        },
        downloadLesson : function(data, callback) {

            app.utilities.Files.callback = callback;
            
           
            var createDirectoryFunction = app.utilities.Files.createDirectory;
            if(IS_DESKTOP) {
                
                createDirectoryFunction = app.utilities.Files.createDirectoryDesktop;
            }
            
            if(data.sounds) {
                for (x in data.sounds) {
                    if(data.sounds[x]) {
                        app.utilities.Files.fileListCheck[data.sounds[x]] = false;
                        createDirectoryFunction(data.sounds[x], 'sound');
                    }
                    
                }
            }
            if(data.videos) {
                for (x in data.videos) {
                    if(data.videos[x]['url']) {
                        app.utilities.Files.fileListCheck[data.videos[x]['url']] = false;
                        createDirectoryFunction(data.videos[x]['url'], 'video');
                    }
                }
            }
            if(data.images) {
                for (x in data.images) {
                    if(data.images[x]) {
                        app.utilities.Files.fileListCheck[data.images[x]] = false;
                        createDirectoryFunction(data.images[x], 'image');
                    }
                }
            }
            app.utilities.Files.checkIfTransferDone();
        },
        checkIfTransferDone : function() {
            var check = app.utilities.Files.checkFileList();
            if(check == true) {
                clearTimeout(app.utilities.Files.checkTransfersTimeout);
                if(app.utilities.Files.callback) {
                   
                    app.utilities.Files.callback();
                }
            } else {
                app.utilities.Files.checkTransfersTimeout = setTimeout(function(){app.utilities.Files.checkIfTransferDone();}, 2000);    
            }
        },
        createDirectory : function(URL, type) {
            var directory = app.utilities.Files.rootDirectory + "/" + type;
            var filename = URL.split('/').pop();
            var filePath = directory + "/" + filename;
            //app.log('creating directory ' + directory);
            //app.log('creating file ' + filePath);
            
            app.utilities.Files.fileSystem.root.getFile(filePath, {create : false}, function(fileEntry) {

                
                app.utilities.Files.fileList[URL] = fileEntry.toURL();
                app.utilities.Files.fileListCheck[URL] = true;
            }, function() {
                app.utilities.Files.fileSystem.root.getDirectory(directory, {create: true}, function(directoryEntry) {
                    app.utilities.Files.createFile(directoryEntry, URL, type);    
               });
            });
            
        },
        createFile : function(directoryEntry, URL, type) {
            var filename = URL.split('/').pop();
            app.log(directoryEntry);
            directoryEntry.getFile(filename, {create: true, exclusive: false}, function(fileEntry){
                    app.utilities.Files.transfer(fileEntry, URL); 
                });    
        },
        transfer : function(fileEntry, URL) {
            var localPath = fileEntry.fullPath;
            var localUrl = fileEntry.toURL();

            //console.log('Loaded local path: ' + localPath);
            //console.log('Loaded local url: ' + localUrl);
            
            if(!(localUrl in  app.utilities.Files.fileListCheck)) {
                var fileTransfer = new FileTransfer();
                console.log("URL=" + URL);
                var uri = encodeURI(URL);
                console.log('Downloading ' + uri + ' to ' + localPath);
                
                fileTransfer.download(uri, localUrl,
                        function(fileEntry) {
                            app.utilities.Files.fileListCheck[URL] = true;
                            
                            app.utilities.Files.fileList[URL] = fileEntry.toURL();
                            console.log('download complete (path): ' + fileEntry.fullPath);
                            console.log('download complete (url): ' + fileEntry.toURL());
                            console.log('download complete (native): ' + fileEntry.toNativeURL());                        
                                        
                        },
                        function(error) {
                            console.log('download error source ' + error.source);
                            console.log('download error target ' + error.target);
                        },
                        true
                    )
            }
        },
        
        //file download functions for Tidesdk
        
        createDirectoryDesktop : function(URL, type) {
            
            app.utilities.Files.tideSDKRootDirectory = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), app.utilities.Files.rootDirectory);
            if(!app.utilities.Files.tideSDKRootDirectory.exists()) {
                app.utilities.Files.tideSDKRootDirectory.createDirectory();
            }    
            
            //app.log("checking for directory=" + app.utilities.Files.tideSDKRootDirectory.nativePath() + "/" + type);
            directory = Ti.Filesystem.getFile(app.utilities.Files.tideSDKRootDirectory.nativePath(), type);
            if(!directory.exists()) {
                directory.createDirectory();
            }    
            
            
            //app.log("file directory=" + directory.nativePath());
            var filename = URL.split('/').pop();
            
            var file = Ti.Filesystem.getFile(directory.nativePath(), filename);
            if(file.exists()) {
                app.utilities.Files.fileList[URL] = "file://" + file.nativePath();
            } else {
                app.utilities.Files.fileListCheck[file.nativePath()] = false;
               
                
                var httpClient = Ti.Network.createHTTPClient();
                
                httpClient.onload = function(e) {
                        // first, grab a "handle" to the file where you'll store the downloaded data
                        //alert(this.responseText);
                        file.open(Ti.Filesystem.MODE_WRITE);
                        file.write(this.responseData); // write to the file
                        app.utilities.Files.fileListCheck[URL] = true;
                        app.utilities.Files.fileList[URL] = "file://" + file.nativePath();
                        console.log('download complete (path): ' + file.nativePath());
                        //console.log('download complete (url): ' + file.nativePath());                
                        //console.log('download complete (native): ' + file.nativePath());
                        
            
                    }
                
                
                httpClient.open('GET', URL);
                httpClient.send();
            }
                    
        },
        
        
        
        
        
        checkFileList : function() {
            var check = true;
            for(x in app.utilities.Files.fileListCheck) {
                //app.log(x + "=" + app.utilities.Files.fileListCheck[x]);
                if(!app.utilities.Files.fileListCheck[x]) {
                    return false;    
                }
            }
            return true;
            
        },
        getLocalFile : function(URL) {
           
            
            if(app.utilities.Files.fileList[URL] && (IS_MOBILE || IS_DESKTOP)) {
                return app.utilities.Files.fileList[URL];    
            } else {
                return URL;
            }
        },
        drawDownloading : function() {
            var html = "<center>";
            html += "Downloading...<br/>";
            html += " <img src='" + LOADING_IMAGE + "' alt='loading...'>";
            html += "</center>";
            var actionBox = new ActionBox({"html" : html, "width" : 200, "height": 200, "buttons" : []});    
        },
        hideDownloading : function() {
            app.utilities.PopUp.close();    
        }
});