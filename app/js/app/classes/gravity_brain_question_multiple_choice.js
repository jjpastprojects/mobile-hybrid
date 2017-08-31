// JavaScript Document
app.registerClass("GravityBrainQuizMultipleChoice", {    
    answer : null,
    
    answerRandomList : null,
    answerSelected : null,
    numberOfAnswersToUse : null,
    renderQuestion : function(answerIndex) {
        app.classes.GravityBrainQuizMultipleChoice.answerSelected = null;
        app.classes.GravityBrainQuizMultipleChoice.answerRandomList = [];
        
        app.classes.GravityBrainQuizMultipleChoice.answer = answerIndex;
        
        app.classes.GravityBrainQuizMultipleChoice.numberOfAnswersToUse = ( app.classes.GravityBrainQuiz.numberOfAnswers < app.classes.GravityBrainQuiz.maxAnswers) ? app.classes.GravityBrainQuiz.numberOfAnswers : app.classes.GravityBrainQuiz.maxAnswers;
        
        app.classes.GravityBrainQuizMultipleChoice.generateRandomAnswerList();
        
        app.classes.GravityBrainQuizMultipleChoice.renderHTML();        
        app.classes.GravityBrainQuizMultipleChoice.initClickEvents();
        
        app.classes.GravityBrainQuiz.playAnswerAudio(function(){});
        app.classes.GravityBrainQuiz.startTimer();
    },
    generateRandomAnswerList : function() {
        var whereToInsertAnswer = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuizMultipleChoice.numberOfAnswersToUse);
        //app.log("whereToInsertAnswer=" + whereToInsertAnswer);
        //app.log("app.classes.GravityBrainQuizMultipleChoice.answerRandomList.length=" + app.classes.GravityBrainQuizMultipleChoice.answerRandomList.length);
        while(app.classes.GravityBrainQuizMultipleChoice.answerRandomList.length < app.classes.GravityBrainQuizMultipleChoice.numberOfAnswersToUse) {
                    
            if(app.classes.GravityBrainQuizMultipleChoice.answerRandomList.length == whereToInsertAnswer) {
                app.classes.GravityBrainQuizMultipleChoice.answerRandomList.push(app.classes.GravityBrainQuizMultipleChoice.answer);
            } else {
                var randomNumber = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.numberOfAnswers);             
                if(randomNumber != app.classes.GravityBrainQuizMultipleChoice.answer) {
                    if($.inArray(randomNumber, app.classes.GravityBrainQuizMultipleChoice.answerRandomList) == -1) {
                       app.classes.GravityBrainQuizMultipleChoice.answerRandomList.push(randomNumber);
                    }   
                }
            }
        }
    },
    renderHTML : function() {
        var answer = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoice.answer].value;
        var answers = [];
        //app.log(app.classes.GravityBrainQuizMultipleChoice.answerRandomList);
        for(x in app.classes.GravityBrainQuizMultipleChoice.answerRandomList) {
            answers[x] = {};
            if(x % 2) {
                answers[x]['oddeven'] = 'even';    
            } else {
                answers[x]['oddeven'] = 'odd';    
            }
            var option = 0;
            if(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoice.answerRandomList[x]]['options'].length > 1) {                                                                                                                      option =  app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoice.answerRandomList[x]]['options'].length);
            }
            if(app.classes.GravityBrainQuizMultipleChoice.answerRandomList[x] == app.classes.GravityBrainQuizMultipleChoice.answer) {                
                app.classes.GravityBrainQuiz.setAnswerOption(option)
            }
            answers[x]['image'] = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoice.answerRandomList[x]]['options'][option]['img'];
            answers[x]['index'] = app.classes.GravityBrainQuizMultipleChoice.answerRandomList[x];
        }            
        app.utilities.Templates.load("multiple_choice_question", "question_container", {"answer" : answer, "answers" : answers});        
    },
    initClickEvents : function() {
        $(".quiz_multiple_choice_option").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                if(app.classes.GravityBrainQuiz.isAnswerSubmitted() || !app.classes.GravityBrainQuiz.isQuestionReady()) {
                    return;    
                }
                app.classes.GravityBrainQuiz.stopTimer();
                var correct = false;
                app.classes.GravityBrainQuiz.setAnswerSubmitted(true);
                
                var clickedAnswer = $(this).data("answer-index");
                app.classes.GravityBrainQuizMultipleChoice.answerSelected = clickedAnswer;
                
                if(clickedAnswer == app.classes.GravityBrainQuizMultipleChoice.answer) {
                    //$("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
                    correct = true;
                } else {
                    $(this).children("img").css("border", "6px solid " + INCORRECT_ANSWER_BORDER);
                    //$("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);                    
                }
               if(IS_MOBILE || IS_DESKTOP) {
                   $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
               } else {
                    $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer).children("img").addClass("blink");
               }
                app.classes.GravityBrainQuiz._endQuestion(correct, clickedAnswer);
            });
    },
    endQuestion : function() {    
        var id = "#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer;
        if(IS_MOBILE || IS_DESKTOP) {
            $(id).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
        } else {
            $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer).children("img").addClass("blink");
        }
        
        app.classes.GravityBrainQuiz._endQuestion(false);
    },
    
        
        
    addCheckmark : function() {
        var img = $('<img class="answer_mark">');
        if(app.classes.GravityBrainQuizMultipleChoice.answerSelected == app.classes.GravityBrainQuizMultipleChoice.answer) {            
            img.attr('src', CORRECT_MARK_IMAGE);
            img.appendTo("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answer);                        
        } else {
            img.attr('src', INCORRECT_MARK_IMAGE);
            img.appendTo("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoice.answerSelected);    
        }
    }
});

