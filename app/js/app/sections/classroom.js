app.registerSection("Classroom", {
    units : null,
    quiz : null,
    quizDisplayDOMId : "",
    audioList : null,
    sounds : null,
    classroomId : null,
    courseId : null,
    courseImage : null,
    classroomName : null,
    unitId : null,
    numberOfUnits : null,
    currentUnit : null,
    currentUnitId : null,
    numberOfUnitLessons : null,
    currentLesson : null,
    autoguideData : null,
    
    imageCSSList : ["/app/images/classroom/righthand_dash_background.jpg",
                "/app/images/classroom/pass_mark_verticle.png",
                "/app/images/classroom/question-square-grey.png",
                "/app/images/classroom/question-square-right.png",
                "/app/images/classroom/question-square-wrong.png",
                "/app/images/classroom/timer_background.png",
                "/app/images/classroom/chalkboard-big-bottom.png",
                "/app/images/video_board/960-540-movie-overlay.png",
                "/app/images/video_board/menu-bottom_lines.png",
                "/app/images/video_board/CourseProgress_Tile_yellow.png",
                "/app/images/video_board/CourseProgress_Tile_grey.png",
                "/app/images/video_board/CourseProgress_Tile_green.png",
                "/app/images/video_board/lesson_description_overlay.png",
                "/app/images/video_board/units-grey.png",
                "/app/images/video_board/units-green.png",
                "/app/images/video_board/Nav_template.png",
                "/app/images/video_board/Nav_template-active.png",
                "/app/images/video_player/handle.png"
                ],
    
    
    load : function(classroomData) {
        $("#top_menu").hide();
        app.sections.Classroom.classroomId = classroomData.classroom_id;
        app.sections.Classroom.classroomName = classroomData.crs_title;
        app.sections.Classroom.courseId = classroomData.course_id;
        app.sections.Classroom.courseImage = classroomData.crs_img;
        app.utilities.Templates.load("classroom", "main", {});
        app.sections.Classroom.sounds = classroomData.sounds;          
        app.sections.Classroom.units = classroomData['units'];
        app.sections.Classroom.numberOfUnits = classroomData['units'].length;
        app.sections.Classroom.createAudioList();
        
            
        app.sections.Classroom.downloadFiles();        
        
        
    },
    
    downloadFiles : function() {
        app.utilities.Files.drawDownloading();
        var data = { "sounds" : app.sections.Classroom.audioList, "images" : app.sections.Classroom.imageCSSList};
        if(IS_DOWNLOAD) {
            app.utilities.Files.downloadLesson(data, app.sections.Classroom.downloadFilesComplete);
        } else {
            app.utilities.Files.preloadLesson(data, app.sections.Classroom.downloadFilesComplete);
        }
        
    },
    downloadFilesComplete : function(data) {
        app.sections.Classroom.loadSounds(); 
                                
        app.api.GravityBrain.getAutoguide({"class_id" : app.sections.Classroom.classroomId}, app.sections.Classroom.setCurrentUnit);  
                          
    },
    
    setCurrentUnit : function(response) {
      
        if(response.success) {
            app.sections.Classroom.autoguideData = response.data;
            app.sections.Classroom.currentUnit = app.sections.Classroom.getUnitNumberById(response.data.unit_id); 
            if(!app.sections.Classroom.currentUnit) {
                alert("No such unit " + response.data.unit_id);
                app.sections.Dashboard.load();    
                return;
            }
            app.sections.Classroom.loadCurrentUnit();    
        } else {
            app.sections.Classroom.handleAutoguideEnd(response);
            
        }
        
    },
    
    handleAutoguideEnd : function(response) {
            if(response.data.finished) {
                if(response.data.reason) {
                    if(response.data.reason == 'done_for_day') {
                         var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("MainApp", "courseDoneForToday"), "width" : 600, "height": 200, "buttons" : [{"id" : "ok_button", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {app.sections.Classroom.exitClassroom();}}]});    
                    } else if(response.data.reason == 'complete') {
                        var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("MainApp", "courseFinished"), "width" : 600, "height": 200, "buttons" : [{"id" : "ok_button", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {app.sections.Classroom.exitClassroom();}}]}); 
                    }
                }
            }  
    },
    
    loadCurrentUnit : function() {
        app.sections.Classroom.loadUnit(app.sections.Classroom.currentUnit);
    },
    loadUnit : function(unitIndex) {
        
        app.sections.Classroom.numberOfUnitLessons = app.sections.Classroom.units[unitIndex]['lessons'].length;
        app.sections.Classroom.currentUnitId = app.sections.Classroom.units[unitIndex]['unt_id'];
        app.sections.Classroom.currentLesson = app.sections.Classroom.getLessonNumberById(unitIndex, app.sections.Classroom.autoguideData.lesson_id);
        app.sections.Classroom.loadCurrentQuiz();        
    },
    loadNextUnit : function() {
        
        if(app.sections.Classroom.currentUnit + 1 < app.sections.Classroom.numberOfUnits) {
            app.sections.Classroom.currentUnit++;            
            app.sections.Classroom.loadCurrentUnit();
        } else {
            app.sections.Classroom.exitClassroom();
        }
    },
    loadCurrentQuiz : function() {
        app.sections.Classroom.loadQuiz(app.sections.Classroom.currentLesson);
    },
    loadQuiz : function(quizIndex) {
        var quizData = app.sections.Classroom.units[app.sections.Classroom.currentUnit]['lessons'][app.sections.Classroom.currentLesson];
        if(!quizData) {
            alert("No such quiz " + app.sections.Classroom.autoguideData.lesson_id);
            app.sections.Dashboard.load();    
            return;
        }
        app.classes.GravityBrainQuiz.load(quizData);
    },
    loadNextQuiz : function() {        
        /*if(app.sections.Classroom.currentLesson + 1 < app.sections.Classroom.numberOfUnitLessons) {            
            app.sections.Classroom.currentLesson++;
            
            app.sections.Classroom.loadCurrentQuiz();            
        } else {
            
            app.sections.Classroom.loadNextUnit();    
        }*/
        app.api.GravityBrain.getAutoguide({"class_id" : app.sections.Classroom.classroomId}, app.sections.Classroom.nextQuizAutoGuideHandler);
        
    },
    nextQuizAutoGuideHandler : function(response) {
         if(response.success) {
            if(response.data.unit_id && response.data.lesson_id) {
                app.sections.Classroom.currentUnit = app.sections.Classroom.getUnitNumberById(response.data.unit_id);
                app.sections.Classroom.currentLesson = app.sections.Classroom.getLessonNumberById(app.sections.Classroom.currentUnit, response.data.lesson_id);
                app.sections.Classroom.loadCurrentQuiz();
            }
        } else {
            app.sections.Classroom.handleAutoguideEnd(response);
            
        }
    },
    loadUnitAndQuiz : function(unitId, lessonId) {
        
        app.sections.Classroom.currentUnit = app.sections.Classroom.getUnitNumberById(unitId);
        app.sections.Classroom.currentLesson = app.sections.Classroom.getLessonNumberById(app.sections.Classroom.currentUnit, lessonId);
        app.sections.Classroom.loadCurrentQuiz();
        
    },
    getUnitNumberById : function(unitId) {
        for(x in app.sections.Classroom.units) {
            if(app.sections.Classroom.units[x]['unt_id'] == unitId) {
                return x;    
            }
        }
    },
    getLessonNumberById : function(unitNumber, lessonId) {
        
        for(x in app.sections.Classroom.units[unitNumber]['lessons']) {
            if(app.sections.Classroom.units[unitNumber]['lessons'][x]['lsn_id'] == lessonId) {
                return x;    
            }
        }    
    },
    completeQuiz : function() {
        
        app.sections.Classroom.sendQuizAttempt();
    },
    getBestGrades : function(classroomId, lessonId, handler) {
        app.api.GravityBrain.getBestGrades({"user_id" : app.classes.GravityBrainUser.getUserId(),"class_id" : classroomId, "lesson_id" :  lessonId}, handler);
    },    
    sendQuizAttempt : function() {
        var data = {};
        data.class_id = app.sections.Classroom.classroomId;
        data.user_id = app.classes.GravityBrainUser.getUserId();
        data.lesson_id = app.classes.GravityBrainQuiz.lessonId;
        data.numCorrect = app.classes.GravityBrainQuiz.numberOfQuestionsCorrect;
        data.quiz_data = {};
        data.quiz_data.start_time = app.classes.GravityBrainQuiz.startTime;
        data.quiz_data.end_time = parseInt(new Date().getTime() / 1000);
        data.quiz_data.answer_data = app.classes.GravityBrainQuiz.userAnswers;
        data.quiz_data.answers = app.classes.GravityBrainQuiz.answers;
        if(app.utilities.Connection.check()) {
            app.api.GravityBrain.sendAttemptQuiz(data, app.sections.Classroom.sendQuizAttemptHandler);
        } else {
            app.classes.QuizStorage.saveQuiz(data);
            var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("DisplayQuiz", "endOfQuizNoConnection"), "width" : 600, "height": 200, "buttons" : [{"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {app.utilities.Security.logout();}}]});
            
        }
    },
    sendQuizAttemptHandler : function(response) {
        if(response.success) {
            app.sections.Classroom.finishQuiz();    
        } else {
            var actionBox = new ActionBox({"text" : response.messages.error.invalid_mark, "width" : 600, "height": 200, "buttons" : [{"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {app.sections.Classroom.loadNextQuiz();}}]});
        }
    },
    finishQuiz : function() {
        var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("DisplayQuiz", "endOfQuiz"), "width" : 600, "height": 200, "buttons" : [{"id" : "cancel", "value" : app.utilities.Languages.getValue("General", "cancel"), "onclick" : function() {app.sections.Classroom.exitClassroom();}}, {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {app.sections.Classroom.loadNextQuiz();}}]});
    },
    stopQuiz : function() {
        app.classes.GravityBrainQuiz.quizStarted = false;
        app.sections.Classroom.exitClassroom();
    },
    exitClassroom : function() {
        app.classes.GravityBrainQuiz.stopTimer();
        app.sections.Dashboard.load();
    },
    createAudioList : function() {
        app.sections.Classroom.audioList = [];        
        if(app.sections.Classroom.sounds) {
            if(app.sections.Classroom.sounds.correct_answer_sounds) {
                for(x in app.sections.Classroom.sounds.correct_answer_sounds) {
                    app.sections.Classroom.audioList.push(app.sections.Classroom.sounds.correct_answer_sounds[x]);
                }
            }
            
            if(app.sections.Classroom.sounds.incorrect_answer_sounds) {
                for(x in app.sections.Classroom.sounds.incorrect_answer_sounds) {
                    app.sections.Classroom.audioList.push(app.sections.Classroom.sounds.incorrect_answer_sounds[x]);
                }
            }
            //app.log(audioList);
            
        } 
    },
    loadSounds : function() {
        app.utilities.Audio.loadAudio(app.sections.Classroom.audioList);
    },
    playCorrectSound : function(correct, callback) {
        if(correct) {
            app.sections.Classroom.playRandomCorrectSound(callback);
        } else {
            app.sections.Classroom.playRandomIncorrectSound(callback);
        }
    },
    playRandomCorrectSound : function(callback) {
        
        var number = app.sections.Classroom.sounds.correct_answer_sounds.length;        
        var randomIndex = app.utilities.Math.getRandomNumber(number)    
        app.utilities.Audio.play(app.sections.Classroom.sounds.correct_answer_sounds[randomIndex], callback);
    },
    playRandomIncorrectSound : function(callback) {
        var number = app.sections.Classroom.sounds.correct_answer_sounds.length;
        var randomIndex = app.utilities.Math.getRandomNumber(number)    
        app.utilities.Audio.play(app.sections.Classroom.sounds.incorrect_answer_sounds[randomIndex], callback);        
    },
    
});