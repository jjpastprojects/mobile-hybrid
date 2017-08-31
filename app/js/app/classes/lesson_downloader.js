// JavaScript Document
app.registerClass("LessonDownloader", {
    callback : null,
    imageList : null,
    audioList : null,
    videolist : null,
    unitNumber : 0,
    lessonNumber : 0,
    units : null,
    
    
    download : function(data, callback) {
        app.classes.LessonDownloader.unitNumber = 0;
        app.classes.LessonDownloader.lessonNumber = 0;
        app.classes.LessonDownloader.units = app.sections.Classroom.units;
        app.classes.LessonDownloader.callback = callback;
        app.utilities.Files.downloadLesson(data, app.classes.LessonDownloader.downloadComplete);
    },
    downloadComplete : function() {
        //app.classes.LessonDownloader.downloadCourse();

        if(app.classes.LessonDownloader.callback) {
            app.classes.LessonDownloader.callback();    
        }
    },
    downloadCourse : function() {
        
        if(app.classes.LessonDownloader.units[app.classes.LessonDownloader.unitNumber]['lessons'][app.classes.LessonDownloader.lessonNumber]) {
            app.classes.LessonDownloader.videoList = app.classes.LessonDownloader.units[app.classes.LessonDownloader.unitNumber]['lessons'][app.classes.LessonDownloader.lessonNumber]['presentations'];
        }
     
        app.classes.LessonDownloader.createImageList(app.classes.LessonDownloader.units[app.classes.LessonDownloader.unitNumber]['lessons'][app.classes.LessonDownloader.lessonNumber].answers);
        app.classes.LessonDownloader.createAudioList(app.classes.LessonDownloader.units[app.classes.LessonDownloader.unitNumber]['lessons'][app.classes.LessonDownloader.lessonNumber].answers);
          
        
        var data = {"videos" : app.classes.LessonDownloader.videoList, "sounds" : app.classes.LessonDownloader.audioList, "images" : app.classes.LessonDownloader.imageList};
        
        app.utilities.Files.downloadLesson(data, app.classes.LessonDownloader.lessonDownloadComplete);

                    
    },
    lessonDownloadComplete : function() {
        if(app.classes.LessonDownloader.lessonNumber + 1 < app.classes.LessonDownloader.units[app.classes.LessonDownloader.unitNumber]['lessons'].length) {
            app.classes.LessonDownloader.lessonNumber++;
        } else {
            if(app.classes.LessonDownloader.unitNumber + 1 < app.classes.LessonDownloader.units.length) {
                app.classes.LessonDownloader.unitNumber++;
                app.classes.LessonDownloader.lessonNumber = 0;
                
            } else {
                return;    
            }
        }
        
        app.classes.LessonDownloader.downloadCourse();
    },
    createImageList : function(answers) {
        app.classes.LessonDownloader.imageList = [];
        if(answers) {
            for(x in answers) {
                for(y in answers[x]['options']) {            
                   app.classes.LessonDownloader.imageList.push(answers[x]['options'][y]['img']);
                }
            }
        }
    },
    createAudioList : function(answers) {
        app.classes.LessonDownloader.audioList = [];
        if(answers) {
            for(x in answers) {
                for(y in answers[x]['options']) {            
                    app.classes.LessonDownloader.audioList.push(answers[x]['options'][y]['sound']);
                }
            }
        }       
    },
    
    
});