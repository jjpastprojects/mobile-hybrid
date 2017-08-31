// JavaScript Document
app.registerClass("GravityBrainDragAndDrop", {    
    answer : null,
    answerValue : null,
    submittedAnswer : null,
    sortable: null,
    splitCharacter : "",
    isSentence : false,
    
    answerRandomList : null,
    renderQuestion : function(answerIndex) {
        app.classes.GravityBrainDragAndDrop.answer = answerIndex;
        app.classes.GravityBrainDragAndDrop.answerValue = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainDragAndDrop.answer]['value'];
        app.classes.GravityBrainDragAndDrop.isSentence = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainDragAndDrop.answer]['is_sentence'];
        console.log('ohhoooooooeeee');
        if(app.classes.GravityBrainDragAndDrop.isSentence) {
            app.classes.GravityBrainDragAndDrop.splitCharacter = " ";
        }
        
        //app.log("app.classes.GravityBrainDragAndDrop.answer=" + app.classes.GravityBrainDragAndDrop.answer);                
                console.log('renderhtml');

        app.classes.GravityBrainDragAndDrop.renderHTML();
        app.classes.GravityBrainDragAndDrop.initClickEvents();
        
        
        app.classes.GravityBrainQuiz.playAnswerAudio(function(){});
        app.classes.GravityBrainQuiz.startTimer();
    },
    
    renderHTML : function() {
                console.log('renderingggggggggggggggggggggghtml');
        var option = 0;
        var image, index, shuffledAnswer;
        var is_sentence = (app.classes.GravityBrainDragAndDrop.isSentence)? "is_sentence" : "";
        if(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainDragAndDrop.answer]['options'].length > 1) {
            option = app.utilities.Math.getRandomNumber(app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainDragAndDrop.answer]['options'].length);            
        }    

                console.log('setanswer');
                console.log(option);
        app.classes.GravityBrainQuiz.setAnswerOption(option);
        image = app.classes.GravityBrainQuiz.answers[app.classes.GravityBrainDragAndDrop.answer]['options'][option]['img'];
        index = app.classes.GravityBrainDragAndDrop.answer;
        console.log("shutfle answer");
        shuffledAnswerArray = app.classes.GravityBrainDragAndDrop.shuffleAnswer2();        
        //shuffledAnswerArray = app.classes.GravityBrainDragAndDrop.answerValue;
        console.log("templateLoad");
        app.utilities.Templates.load("drag_drop_question", "question_container", {"index" : index, "image" : image, "shuffledAnswerArray" : shuffledAnswerArray, "is_sentence" : is_sentence});
      
                console.log('container');
        
        var container = document.getElementById("drag_and_drop_answer_container");
                console.log('eventsetup');
        app.classes.GravityBrainDragAndDrop.sortable = new Sortable(container, {
       
            draggable: ".drag_and_drop_item", // Specifies which items inside the element should be sortable
            onUpdate: function (evt/**Event*/){
            var item = evt.item; // the current dragged HTMLElement
        }
        });

                console.log('focus');
         $("#quiz_drag_and_drop_entry").focus();
    },
    shuffleAnswer : function() {
        var val = app.classes.GravityBrainDragAndDrop.answerValue;
        var a = val.split(app.classes.GravityBrainDragAndDrop.splitCharacter),
        n = a.length;
        do {
            for(var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp; // SHANEHERE
            }
            var newValue = a.join(app.classes.GravityBrainDragAndDrop.splitCharacter);
            //app.log("val=" + val);
            //app.log("newValue=" + newValue);
        }while(newValue == val && val.length > 1);
        return a;
    },
    shuffleAnswer2 : function() {
        var val = app.classes.GravityBrainDragAndDrop.answerValue;
        var a = val.split(app.classes.GravityBrainDragAndDrop.splitCharacter),
        array = a;

        var tmp, current, top = array.length;

        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
        return array;
    },
    checkAnswer : function() {
        var inputAnswer = "";
        var modifiedAnswer = app.classes.GravityBrainDragAndDrop.answerValue.replace(/ /g, "");
        $(".drag_and_drop_item").each(function() {
                inputAnswer += $(this).data("value");                                   
            });
        app.classes.GravityBrainDragAndDrop.submittedAnswer = inputAnswer.replace(" ", "");
        
        if(inputAnswer == modifiedAnswer) {
            return true;
        } else {
            return false;    
        }
    },
    initClickEvents : function() {
        $("#drag_and_drop_answer_submit").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                app.classes.GravityBrainDragAndDrop.onSubmitAnswer();
            });
        $("#quiz_drag_and_drop_entry").unbind('keypress').on('keypress',function (e) {
          if (e.which == 13) {
            app.classes.GravityBrainDragAndDrop.onSubmitAnswer();
            return false;    //<---- Add this line
          }
        });
    },
    onSubmitAnswer : function() {
        if(app.classes.GravityBrainQuiz.isAnswerSubmitted() || !app.classes.GravityBrainQuiz.isQuestionReady()) {
            return;    
        }
        app.classes.GravityBrainQuiz.stopTimer();
        //app.classes.GravityBrainDragAndDrop.sortable.destroy();                
        var correct = false;
        
        if(app.classes.GravityBrainDragAndDrop.checkAnswer()) {
            correct = true;
        } else {
            
        }    
        app.classes.GravityBrainQuiz.displayCorrectAnswer();
        app.classes.GravityBrainQuiz._endQuestion(correct, app.classes.GravityBrainDragAndDrop.submittedAnswer);
        
    },
    endQuestion : function() {    
        var correct = false;
        app.log("end question");
        //app.classes.GravityBrainDragAndDrop.sortable.destroy();
        if(app.classes.GravityBrainDragAndDrop.checkAnswer()) {
            correct = true;
        } else {
            
        }        
        app.classes.GravityBrainQuiz.displayCorrectAnswer();
        app.classes.GravityBrainQuiz._endQuestion(correct, app.classes.GravityBrainDragAndDrop.submittedAnswer);
        
    }
    
});

