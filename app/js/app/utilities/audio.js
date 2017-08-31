app.registerUtility("Audio", {
    audioList : {},
    
    init : function() {
            
    },
    loadAudio : function(audioList) {
        var fileLocation = "";
        for(x in audioList) {
            //app.log(audioList[x]);
            fileLocation = app.utilities.Files.getLocalFile(audioList[x]);

            app.utilities.Audio.audioList[audioList[x]] = new Audio(fileLocation);    
        }
    },
    play : function(fileName, callback) {
        //app.log("----------------------" + callback);
        
        var callbackModified = function() {
            app.utilities.Audio.audioList[fileName].removeEventListener('ended', callbackModified);
            callback();
            
        }
        if(callback) {
            app.utilities.Audio.audioList[fileName].addEventListener('ended', callbackModified);
            
        }
        app.utilities.Audio.audioList[fileName].play();    
        
    }
    
});