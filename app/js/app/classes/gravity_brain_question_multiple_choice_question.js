// JavaScript Document
app.registerClass("GravityBrainQuizMultipleChoiceQuestion", {    
    answer : null,
    questionIndex : null,
    question : null,
    answerRandomList : null,
    answerSelected : null,
    numberOfAnswersToUse : null,
    renderQuestion : function(answerIndex) {
        app.classes.GravityBrainQuizMultipleChoiceQuestion.answerSelected = null;
        app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList = [];
        
        app.classes.GravityBrainQuizMultipleChoiceQuestion.answer = answerIndex;
        app.classes.GravityBrainQuizMultipleChoiceQuestion.questionIndex = app.classes.GravityBrainQuiz.currentQuestionIndex;
        

        
        app.classes.GravityBrainQuizMultipleChoiceQuestion.numberOfAnswersToUse = ( app.classes.GravityBrainQuiz.numberOfAnswers < app.classes.GravityBrainQuiz.maxAnswers) ? app.classes.GravityBrainQuiz.numberOfAnswers : app.classes.GravityBrainQuiz.maxAnswers;
        
        app.classes.GravityBrainQuizMultipleChoiceQuestion.generateRandomAnswerList();
        
        app.classes.GravityBrainQuizMultipleChoiceQuestion.renderHTML();        
        app.classes.GravityBrainQuizMultipleChoiceQuestion.initClickEvents();
        
        app.classes.GravityBrainQuiz.playAnswerAudio(function(){});
        app.classes.GravityBrainQuiz.startTimer();
    },
    generateRandomAnswerList : function() {
        var whereToInsertAnswer = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuizMultipleChoiceQuestion.numberOfAnswersToUse);
        //app.log("whereToInsertAnswer=" + whereToInsertAnswer);
        //app.log("app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.length=" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.length);
        while(app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.length < app.classes.GravityBrainQuizMultipleChoiceQuestion.numberOfAnswersToUse) {
                    
            if(app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.length == whereToInsertAnswer) {
                app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.push(app.classes.GravityBrainQuizMultipleChoiceQuestion.answer);
            } else {
                var randomNumber = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.numberOfAnswers);             
                if(randomNumber != app.classes.GravityBrainQuizMultipleChoiceQuestion.answer) {
                    if($.inArray(randomNumber, app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList) == -1) {
                       app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList.push(randomNumber);
                    }   
                }
            }
        }
    },
    renderHTML : function() {
        var answer = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoiceQuestion.answer].value;
        var question = app.classes.GravityBrainQuiz.questionList[app.classes.GravityBrainQuizMultipleChoiceQuestion.questionIndex]['text'];
        var answers = [];
        //app.log(app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList);
        for(x in app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList) {
            answers[x] = {};
            if(x % 2) {
                answers[x]['oddeven'] = 'even';    
            } else {
                answers[x]['oddeven'] = 'odd';    
            }
            var option = 0;
            if(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x]]['options'].length > 1) {                                                                                                                      option =  app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x]]['options'].length);
            }
            if(app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x] == app.classes.GravityBrainQuizMultipleChoiceQuestion.answer) {                
                app.classes.GravityBrainQuiz.setAnswerOption(option)
            }
            answers[x]['value'] = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x]]['value'];
            answers[x]['image'] = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x]]['options'][option]['img'];
            answers[x]['index'] = app.classes.GravityBrainQuizMultipleChoiceQuestion.answerRandomList[x];
        }            
        app.utilities.Templates.load("multiple_choice_question_question", "question_container", {"question" : question, "answers" : answers});        
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
                app.classes.GravityBrainQuizMultipleChoiceQuestion.answerSelected = clickedAnswer;
                
                if(clickedAnswer == app.classes.GravityBrainQuizMultipleChoiceQuestion.answer) {
                    //$("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
                    correct = true;
                } else {
                    $(this).children("img").css("border", "6px solid " + INCORRECT_ANSWER_BORDER);
                    //$("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);                    
                }
               if(IS_MOBILE || IS_DESKTOP) {
                   $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
               } else {
                    $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer).children("img").addClass("blink");
               }
                app.classes.GravityBrainQuiz._endQuestion(correct, clickedAnswer);
            });
    },
    endQuestion : function() {    
        var id = "#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer;
        if(IS_MOBILE || IS_DESKTOP) {
            $(id).children("img").css("border", "6px solid " + CORRECT_ANSWER_BORDER);
        } else {
            $("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer).children("img").addClass("blink");
        }
        
        app.classes.GravityBrainQuiz._endQuestion(false);
    },
    
        
        
    addCheckmark : function() {
        var img = $('<img class="answer_mark">');
        if(app.classes.GravityBrainQuizMultipleChoiceQuestion.answerSelected == app.classes.GravityBrainQuizMultipleChoiceQuestion.answer) {            
            img.attr('src', CORRECT_MARK_IMAGE);
            img.appendTo("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answer);                        
        } else {
            img.attr('src', INCORRECT_MARK_IMAGE);
            img.appendTo("#quiz_multiple_choice_option_" + app.classes.GravityBrainQuizMultipleChoiceQuestion.answerSelected);    
        }
    }
});

