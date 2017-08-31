// JavaScript Document
app.registerClass("GravityBrainQuizFillInTheBlank", {    
    answer : null,
    answerRandomList : null,
    isSentence : false,
    frag1 : false,
    frag2 : false,
    
    renderQuestion : function(answerIndex) {
        var clickEvent = CLICK_EVENT + ".fillintheblank";
        $(document).unbind(clickEvent).bind(clickEvent, function() {
                $("#fill_in_blank_answer_input").focus();    
            });
        app.classes.GravityBrainQuiz.documentClicks.push(clickEvent);            
        
        app.classes.GravityBrainQuizFillInTheBlank.answer = answerIndex;
        app.log("app.classes.GravityBrainQuizFillInTheBlank.answer=" + app.classes.GravityBrainQuizFillInTheBlank.answer);    
        app.classes.GravityBrainQuizFillInTheBlank.isSentence = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['is_sentence'];
        
         app.classes.GravityBrainQuizFillInTheBlank.frag1 = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['frag1'];
         
          app.classes.GravityBrainQuizFillInTheBlank.frag2 = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['frag2'];
        

                    
        app.classes.GravityBrainQuizFillInTheBlank.renderHTML();
        app.classes.GravityBrainQuizFillInTheBlank.initClickEvents();
        

        app.classes.GravityBrainQuiz.playAnswerAudio(function(){});
        app.classes.GravityBrainQuiz.startTimer();
        
    },
    
    renderHTML : function() {
        var option = 0;
        var image, index;
        var is_sentence = (app.classes.GravityBrainQuizFillInTheBlank.isSentence)? "is_sentence" : "";
        
        if(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['options'].length > 1) {                                                                                                                  option = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['options'].length);
            
        }    
        app.classes.GravityBrainQuiz.setAnswerOption(option);
        image = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainQuizFillInTheBlank.answer]['options'][option]['img'];
        index = app.classes.GravityBrainQuizFillInTheBlank.answer;
        
        
        app.utilities.Templates.load("fill_in_the_blank_question", "question_container", {"index" : index, "image" : image, "is_sentence" : is_sentence, "frag1" :  app.classes.GravityBrainQuizFillInTheBlank.frag1, "frag2" :  app.classes.GravityBrainQuizFillInTheBlank.frag2});
        $("#fill_in_blank_answer_input").focus();
        
    },
    initClickEvents : function() {
        $("#fill_in_blank_answer_submit").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {                                                                                    
                app.classes.GravityBrainQuizFillInTheBlank.onSubmitAnswer();                
            });
        
        $("#fill_in_blank_answer_input").unbind('keypress').on('keypress',function (e) {
          if (e.which == 13) {
            app.classes.GravityBrainQuizFillInTheBlank.onSubmitAnswer();
            return false;    //<---- Add this line
          }
        });
    },
    onSubmitAnswer : function() {
        if(app.classes.GravityBrainQuiz.isAnswerSubmitted() || !app.classes.GravityBrainQuiz.isQuestionReady()) {
            return;    
        }
        app.classes.GravityBrainQuiz.stopTimer();
        var correct = false;
        app.classes.GravityBrainQuiz.setAnswerSubmitted(true);
        //app.log("answer clicked");                
        var inputAnswer = $("#fill_in_blank_answer_input").val();
        app.log("app.classes.GravityBrainQuiz.getAnswerValue()=" + app.classes.GravityBrainQuiz.getAnswerValue());
        //app.log("inputAnswer=" + inputAnswer);
        if(inputAnswer == app.classes.GravityBrainQuiz.getAnswerValue()) {
            correct = true;
        } else {
            app.classes.GravityBrainQuiz.displayCorrectAnswer();
        }
        app.classes.GravityBrainQuiz._endQuestion(correct, inputAnswer);
    },
    endQuestion : function() {    
        var correct = false;
        var inputAnswer = $("#fill_in_blank_answer_input").val();
        app.log("end question");
        if(inputAnswer == app.classes.GravityBrainQuiz.getAnswerValue()) {
            correct = true;
        } else {
            app.classes.GravityBrainQuiz.displayCorrectAnswer();
        }
        app.classes.GravityBrainQuiz._endQuestion(correct, inputAnswer);
        
    }
});

