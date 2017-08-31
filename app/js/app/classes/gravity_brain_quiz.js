// JavaScript Document
app.registerClass("GravityBrainQuiz", {    
    
    lessonId : null,
    questions : null,
    questionList : null,
    maxAnswers : 4,
    answers : null,
    questionAnswers : null,
    numberOfAnswers : null,
    numberOfQuestions : null,
    numberOfQuestionsRequiredToPass : null,
    maxTime : null,
    timerMC : null,
    timerFIB : null,
    timerDND : null,
    timerMCQ : null,
    imageList : null,
    audioList : null,
    videoFiles : null,
    videoPlayer : null,
    currentQuestion : 0,
    numberOfQuestionsCorrect : 0,
    numberOfQuestionsIncorrect : 0,
    answerSubmitted : false,
    questionReady : false,
    timerCanReset : true,
    timerResetCount : 0,
    
    renderNextQuestionTimeout : null,
    rotateTimeout : null,
    
    timerModel : null,
    
    currentQuestionIndex : null,

    currentAnswer : null,
    currentOption : null,
    
    currentQuestionClass : null,
        
    answersAlreadyUsed : [],
    
    bestScoreData : null,
    bestScoreModel : null,
    
    quizStarted : false,
    
    documentClicks : [],
    
    startTime : null,
    endTime : null,
    userAnswers : {},
    
    load : function(data) {
        
        var terms = [];
        var html = null;
        
        app.classes.GravityBrainQuiz.lessonId = data.lsn_id;
        app.classes.GravityBrainQuiz.numberOfQuestions = data.qiz_totalWeight;
        app.classes.GravityBrainQuiz.numberOfQuestionsRequiredToPass = data.qiz_passWeight;
        
        app.classes.GravityBrainQuiz.timerMC = data.metadata.timer_mc;
        app.classes.GravityBrainQuiz.timerFIB = data.metadata.timer_fib;
        app.classes.GravityBrainQuiz.timerDND = data.metadata.timer_dnd;
        app.classes.GravityBrainQuiz.timerMCQ = data.metadata.timer_mcq;

        
        app.classes.GravityBrainQuiz.questions = data.questions;
        
        app.classes.GravityBrainQuiz.questionList = data.question_list;

        
        app.classes.GravityBrainQuiz.getBestGrades();
        
        $("#marking_results").append('<div class="clear"></div>');
        app.classes.GravityBrainQuiz.answers = data.answers;
        for(x in app.classes.GravityBrainQuiz.answers) {
            terms.push(app.classes.GravityBrainQuiz.answers[x].value);
        }
        if(data.metadata.show_answer_key) {
            app.utilities.Templates.load("classroom_terms", "classroom_terms", {"terms" : terms});
        }
        
        app.classes.GravityBrainQuiz.numberOfAnswers = app.classes.GravityBrainQuiz.answers.length;
        app.classes.GravityBrainQuiz.videoFiles = data.presentations;        
        app.classes.GravityBrainQuiz.createImageList();
        app.classes.GravityBrainQuiz.createAudioList();
        
            
        app.classes.GravityBrainQuiz.downloadLesson();
        app.classes.GravityBrainQuiz.initButtons();
        
                
    },
    preloadImages : function() {
        var images = new Array();
        for(x in app.classes.GravityBrainQuiz.imageList) {
            //app.log(app.classes.GravityBrainQuiz.imageList[x]);
            app.classes.GravityBrainQuiz.imageList               
            images[x] = new Image()
            images[x].src = app.classes.GravityBrainQuiz.imageList[x]; 
        }
        app.classes.GravityBrainQuiz.loadSounds();
        app.sections.VideoBoard.loadVideoBoard();
    },
    downloadLesson : function() {
        app.utilities.Files.drawDownloading();
        var data = {"videos" : app.classes.GravityBrainQuiz.videoFiles, "sounds" : app.classes.GravityBrainQuiz.audioList, "images" : app.classes.GravityBrainQuiz.imageList};
        
        if(IS_DOWNLOAD) {
            app.classes.LessonDownloader.download(data, app.classes.GravityBrainQuiz.downloadLessonComplete);
        } else {
            app.utilities.Files.preloadLesson(data, app.classes.GravityBrainQuiz.downloadLessonComplete);
        }
       
        
    },
    downloadLessonComplete : function(data) {
         if(app.classes.GravityBrainQuiz.answers) {
            for(x in app.classes.GravityBrainQuiz.answers) {
                for(y in app.classes.GravityBrainQuiz.answers[x]['options']) {            
                    app.classes.GravityBrainQuiz.answers[x]['options'][y]['img'] = app.utilities.Files.getLocalFile(app.classes.GravityBrainQuiz.answers[x]['options'][y]['img']);
                    
                }
            }
        }
        app.utilities.Files.hideDownloading();
        app.classes.GravityBrainQuiz.loadSounds();
        app.sections.VideoBoard.loadVideoBoard();    
    },
    getBestGrades : function() {
        app.sections.Classroom.getBestGrades(app.sections.Classroom.classroomId, app.classes.GravityBrainQuiz.lessonId, app.classes.GravityBrainQuiz.getBestGradesHandler);
    },
    
    getBestGradesHandler : function(response) {    
        
        app.classes.GravityBrainQuiz.bestScoreData = response.data.best_grades;        
        app.classes.GravityBrainQuiz.bestScoreModel = new BestGrades("quiz_best_grades_container", app.classes.GravityBrainQuiz.bestScoreData);
        app.classes.GravityBrainQuiz.bestScoreModel.renderBestGrades();
    },
    
    
    updateCurrentBestGrade : function() {
        app.classes.GravityBrainQuiz.bestScoreModel.updateBestGradeForQuiz(app.classes.GravityBrainQuiz.numberOfQuestionsCorrect, app.classes.GravityBrainQuiz.numberOfQuestionsIncorrect);
    },
    renderMarkingResults : function() {
        var questionType = null;
        $("#marking_results").html("");
        for(x in app.classes.GravityBrainQuiz.questions) {
            if(!questionType ) {
                questionType = app.classes.GravityBrainQuiz.questions[x]['type'];
                html = '<div class="result_box" id="result_box_' + x +'"></div>';
                
            } else  if(app.classes.GravityBrainQuiz.questions[x]['type'] != questionType) {
                questionType = app.classes.GravityBrainQuiz.questions[x]['type'];
                html = '<div class="clear"></div><div class="result_box" id="result_box_' + x +'"></div>';
            } else {
                html = '<div class="result_box" id="result_box_' + x +'"></div>';    
            }
            
            $("#marking_results").append(html);
        }
    },
    createImageList : function() {
        app.classes.GravityBrainQuiz.imageList = [];
        if(app.classes.GravityBrainQuiz.answers) {
            for(x in app.classes.GravityBrainQuiz.answers) {
                for(y in app.classes.GravityBrainQuiz.answers[x]['options']) {            
                    app.classes.GravityBrainQuiz.imageList.push(app.classes.GravityBrainQuiz.answers[x]['options'][y]['img']);
                }
            }
        }
    },
    createAudioList : function() {
        app.classes.GravityBrainQuiz.audioList = [];
        if(app.classes.GravityBrainQuiz.answers) {
            for(x in app.classes.GravityBrainQuiz.answers) {
                for(y in app.classes.GravityBrainQuiz.answers[x]['options']) {            
                    app.classes.GravityBrainQuiz.audioList.push(app.classes.GravityBrainQuiz.answers[x]['options'][y]['sound']);
                }
            }
        }       
    },
    
    loadSounds : function() {
        app.utilities.Audio.loadAudio(app.classes.GravityBrainQuiz.audioList);
    },
    
    loadQuiz : function() {
        app.classes.GravityBrainQuiz.numberOfQuestionsIncorrect = 0;
        app.classes.GravityBrainQuiz.numberOfQuestionsCorrect = 0;
        app.classes.GravityBrainQuiz.getBestGrades();
        app.classes.GravityBrainQuiz.renderMarkingResults();
        app.classes.GravityBrainQuiz.currentQuestion = 0;
        app.classes.GravityBrainQuiz.quizStarted = true;
        setTimeout(function() {app.classes.GravityBrainQuiz.renderCurrentQuestion();}, 500);
    },
    renderCurrentQuestion : function() {   
        if(!app.classes.GravityBrainQuiz.startTime) {
            app.classes.GravityBrainQuiz.startTime = parseInt(new Date().getTime() / 1000);
        }
        app.classes.GravityBrainQuiz.renderQuestion(app.classes.GravityBrainQuiz.currentQuestion);    
    },
    selectAnswersForQuestion : function() {
            
    },
    selectAnswerForQuestion : function(questionIndex) {
        var answerFound = false;
        var questionWithAnswerFound = false;
        var randomNumber = null;
        var allFound = false;
        while(answerFound == false) {
            randomNumber = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.numberOfAnswers);
            
            allFound = true;
            for(var x in app.classes.GravityBrainQuiz.answers) {
                
                if(app.classes.GravityBrainQuiz.answersAlreadyUsed.indexOf(parseInt(x)) == -1) {
                    allFound = false;
                    
                }
            }
            
            if(app.classes.GravityBrainQuiz.answersAlreadyUsed.length == 0 || (!allFound && $.inArray(randomNumber, app.classes.GravityBrainQuiz.answersAlreadyUsed) == -1) || (allFound  && app.classes.GravityBrainQuiz.answersAlreadyUsed[app.classes.GravityBrainQuiz.answersAlreadyUsed.length - 1] != randomNumber) || (allFound && app.classes.GravityBrainQuiz.numberOfAnswers == 1)) {
                app.classes.GravityBrainQuiz.answersAlreadyUsed.push(randomNumber);
                answerFound = true;    
            }
            if(answerFound) {
                if(app.classes.GravityBrainQuiz.questions[questionIndex]['type'] == QUESTION_TYPE_MULTIPLE_CHOICE_QUESTION) {
                    
                    for(x in app.classes.GravityBrainQuiz.questionList) {
                        if(app.classes.GravityBrainQuiz.questionList[x]['answer_id'] == app.classes.GravityBrainQuiz.answers[randomNumber]['id']) {
                            questionWithAnswerFound = true;
                            
                            app.classes.GravityBrainQuiz.currentQuestionIndex = x;
                        }
                    }
                    if(!questionWithAnswerFound) {
                        answerFound = false;
                    }
                }
            }
            
                     
        }
        return randomNumber;
                                                           
    },
    renderQuestion : function(questionIndex) {
        if(!app.classes.GravityBrainQuiz.quizStarted) {
            return;    
        }
        if(app.classes.GravityBrainQuiz.documentClicks) {
            for(x in app.classes.GravityBrainQuiz.documentClicks) {
                $(document).unbind(app.classes.GravityBrainQuiz.documentClicks[x]);    
            }
        }
        app.classes.GravityBrainQuiz.setAnswerSubmitted(false);
        app.classes.GravityBrainQuiz.questionReady = false
        var answerIndex = app.classes.GravityBrainQuiz.currentAnswer = app.classes.GravityBrainQuiz.selectAnswerForQuestion(questionIndex);
        
        
        if(app.classes.GravityBrainQuiz.questions[questionIndex]['type'] == QUESTION_TYPE_MULTIPLE_CHOICE) {
            app.classes.GravityBrainQuiz.maxTime = app.classes.GravityBrainQuiz.timerMC;
            app.classes.GravityBrainQuiz.currentQuestionClass = app.classes.GravityBrainQuizMultipleChoice;
            app.classes.GravityBrainQuiz.currentQuestionClass.renderQuestion(answerIndex);    
            
        } else if(app.classes.GravityBrainQuiz.questions[questionIndex]['type'] == QUESTION_TYPE_FILL_IN_THE_BLANK) {
            app.classes.GravityBrainQuiz.maxTime = app.classes.GravityBrainQuiz.timerFIB;
            app.classes.GravityBrainQuiz.currentQuestionClass = app.classes.GravityBrainQuizFillInTheBlank;
            app.classes.GravityBrainQuiz.currentQuestionClass.renderQuestion(answerIndex);
            
        } else if(app.classes.GravityBrainQuiz.questions[questionIndex]['type'] == QUESTION_TYPE_DRAG_AND_DROP) {
            console.log("hey drag and droppers");
            console.log(app.classes.GravityBrainQuiz);
            console.log(app.classes.GravityBrainQuiz.currentQuestionClass);
            app.classes.GravityBrainQuiz.maxTime = app.classes.GravityBrainQuiz.timerDND;
            app.classes.GravityBrainQuiz.currentQuestionClass = app.classes.GravityBrainDragAndDrop;
            app.classes.GravityBrainQuiz.currentQuestionClass.renderQuestion(answerIndex);
            
        } else if(app.classes.GravityBrainQuiz.questions[questionIndex]['type'] == QUESTION_TYPE_MULTIPLE_CHOICE_QUESTION) {
            app.classes.GravityBrainQuiz.maxTime = app.classes.GravityBrainQuiz.timerMCQ;
            app.classes.GravityBrainQuiz.currentQuestionClass = app.classes.GravityBrainQuizMultipleChoiceQuestion;
            app.classes.GravityBrainQuiz.currentQuestionClass.renderQuestion(answerIndex);    
            
        } 
    },
    renderNextQuestion : function() {
        app.classes.GravityBrainQuiz.timerResetCount = 0;
        app.classes.GravityBrainQuiz.timerModel.renderNextQuestionTimeout = setTimeout(function() { 
                
            if(app.classes.GravityBrainQuiz.currentQuestion + 1 < app.classes.GravityBrainQuiz.questions.length) {
                app.classes.GravityBrainQuiz.currentQuestion++;    
                app.classes.GravityBrainQuiz.renderCurrentQuestion();
            } else {
                app.sections.Classroom.completeQuiz();    
            }
        },        
        DELAY_BETWEEN_QUESTIONS);        
    },
    displayCorrectAnswer : function() {
        $("#correct_answer").show();
        $("#correct_answer").html(app.classes.GravityBrainQuiz.getAnswerValue());
    },
    _endQuestion : function(correct, answered) {
        app.classes.GravityBrainQuiz.questionReady = false;
        app.classes.GravityBrainQuiz.userAnswers[app.classes.GravityBrainQuiz.currentQuestion] = {};
        app.classes.GravityBrainQuiz.userAnswers[app.classes.GravityBrainQuiz.currentQuestion].correct = correct;
        app.classes.GravityBrainQuiz.userAnswers[app.classes.GravityBrainQuiz.currentQuestion].answered = answered;
         app.classes.GravityBrainQuiz.userAnswers[app.classes.GravityBrainQuiz.currentQuestion].answer = app.classes.GravityBrainQuiz.currentAnswer;
        if(!app.classes.GravityBrainQuiz.quizStarted) {
            return;    
        }
        if(correct) {
            app.classes.GravityBrainQuiz.addCorrectScoreForCurrentQuestion();    
            $("#result_box_" + app.classes.GravityBrainQuiz.currentQuestion).addClass("correct");
        } else {
            app.classes.GravityBrainQuiz.addIncorrectScoreForCurrentQuestion();    
            $("#result_box_" + app.classes.GravityBrainQuiz.currentQuestion).addClass("incorrect");
        }
        if(app.classes.GravityBrainQuiz.currentQuestionClass.addCheckmark) {
            app.classes.GravityBrainQuiz.currentQuestionClass.addCheckmark();
        } else {        
            if(correct) {                
                
                var img = $('<img class="answer_mark">'); //Equivalent: $(document.createElement('img'))
                img.attr('src', CORRECT_MARK_IMAGE);
                img.appendTo('.answer_container');
            } else {                
                
                var img = $('<img class="answer_mark">'); //Equivalent: $(document.createElement('img'))
                img.attr('src', INCORRECT_MARK_IMAGE);
                img.appendTo('.answer_container');
            }
        }
        app.classes.GravityBrainQuiz.updateCurrentBestGrade();
        app.sections.Classroom.playCorrectSound(correct, app.classes.GravityBrainQuiz.playAnswerAudioAndNextQuestion);
    },
    playAnswerAudioAndNextQuestion : function() {
        if(!app.classes.GravityBrainQuiz.quizStarted) {
            return;    
        }
        app.classes.GravityBrainQuiz.playAnswerAudio(app.classes.GravityBrainQuiz.renderNextQuestion);
    },
    playAnswerAudio : function(callback) {
        if(!app.classes.GravityBrainQuiz.quizStarted) {
            return;    
        }
        if(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuiz.currentAnswer]['options'][app.classes.GravityBrainQuiz.currentOption]['sound']) {
            app.utilities.Audio.play(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuiz.currentAnswer]['options'][app.classes.GravityBrainQuiz.currentOption]['sound'], callback);
        } else {
            callback();    
        }
    },
    addCorrectScoreForCurrentQuestion : function() {
        app.classes.GravityBrainQuiz.numberOfQuestionsCorrect++;
    },
    addIncorrectScoreForCurrentQuestion : function() {
        app.classes.GravityBrainQuiz.numberOfQuestionsIncorrect++;
    },
    setAnswerOption : function(option) {
        app.classes.GravityBrainQuiz.currentOption = option;
    },
    getAnswerValue : function() {
        return app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuiz.currentAnswer]['value'];
    },    
    resetTimer : function() {
        //app.classes.GravityBrainQuiz.currentQustionClass.stopTimer();
        //app.classes.GravityBrainQuiz.currentQustionClass.startTimer();
    },
    startTimer : function() {
        
        if(app.classes.GravityBrainQuiz.maxTime != 0) {
            var time = app.classes.GravityBrainQuiz.maxTime * MS_PER_SEC;
    
            app.classes.GravityBrainQuiz.questionReady = true;
                    
            //TODO change timescale to reflect distance away from target angle. Also, remove hardcoded times
            app.classes.GravityBrainQuiz.timerModel = new Model("timer","images/classroom/timer_face.png");
            app.classes.GravityBrainQuiz.timerModel.rotate(360, REWIND_TIME, function() {                                                                                
            setTimeout(function() {    
                        app.classes.GravityBrainQuiz.timerModel.rotate(0, time, function(){app.classes.GravityBrainQuiz.currentQuestionClass.endQuestion();});
                        
                        },100);
            });
            app.classes.GravityBrainQuiz.timerCanReset = false;
            setTimeout(function() {app.classes.GravityBrainQuiz.timerCanReset = true;}, TIMER_RESET_DELAY);                
        }  else if (app.classes.GravityBrainQuiz.maxTime == 0) {
                app.classes.GravityBrainQuiz.questionReady = true;

        }
    
    }, 
    
    stopTimer : function() {
        
        if(app.classes.GravityBrainQuiz.timerModel) {
            app.classes.GravityBrainQuiz.timerModel.stopRotate();
        }
        app.classes.GravityBrainQuiz.questionReady = false;
        
    },
    initButtons : function() {
        
        $("#view_video_button").unbind(CLICK_EVENT).on(CLICK_EVENT,  function() {
                app.classes.GravityBrainQuiz.quizStarted = false;
                app.classes.GravityBrainQuiz.stopTimer();
                $("#classroom_lesson").hide();
                app.sections.VideoBoard.loadVideoBoard();
                //app.classes.GravityBrainQuiz.videoPlayer.restart();                
            });
        
        $("#timer").unbind(CLICK_EVENT).on(CLICK_EVENT,  function() {
                if(app.classes.GravityBrainQuiz.timerCanReset && app.classes.GravityBrainQuiz.timerResetCount == 0) {
                    app.classes.GravityBrainQuiz.stopTimer();
                    app.classes.GravityBrainQuiz.startTimer();
                    app.classes.GravityBrainQuiz.timerResetCount++;
               
                } else {
                    app.log("unable to reset");
                }
                
            });
        
        $("#quiz_stop_quiz_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                
                app.classes.GravityBrainQuiz.stopTimer();
                app.sections.Classroom.stopQuiz();
                
                
            });
         $("#autoguide_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                    //app.api.GravityBrain.getAutoguide({"class_id" : app.sections.Classroom.classroomId}, app.sections.Classroom.autoguideHandler);
                });
    },
    setAnswerSubmitted : function(trueOrFalse) {
        app.classes.GravityBrainQuiz.answerSubmitted = trueOrFalse;
    },
    isAnswerSubmitted : function() {
        return     app.classes.GravityBrainQuiz.answerSubmitted;
    },
    isQuestionReady : function() {
        return     app.classes.GravityBrainQuiz.questionReady;     
    },
    autoguideHandler : function(response) {
        /*if(response.success) {
            if(response.data.unit_id && response.data.lesson_id) {
                app.sections.VideoBoard.selectedUnitNumber = app.sections.Classroom.getUnitNumberById(response.data.unit_id);
                app.sections.VideoBoard.selectedLessonNumber = app.sections.Classroom.getLessonNumberById(app.sections.VideoBoard.selectedUnitNumber, response.data.lesson_id);
                app.sections.VideoBoard.activateUnit();
            }
        }*/
    }
    
                  
});
