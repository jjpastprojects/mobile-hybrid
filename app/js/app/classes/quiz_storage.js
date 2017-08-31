// JavaScript Document

// JavaScript Document
app.registerClass("QuizStorage", {
    
    saveQuiz : function(data) {
        var storedQuizzes = app.utilities.Storage.get("stored_quizzes");
        if(!storedQuizzes) {
            storedQuizzes = [];
        }
		storedQuizzes[storedQuizzes.length] = 	data;
		app.utilities.Storage.store("stored_quizzes", storedQuizzes);    
    },
    sendStoredQuizzes : function() {
        var storedQuizzes = app.utilities.Storage.get("stored_quizzes"); 
        if(storedQuizzes != null ) {
            
            for(x in storedQuizzes) {
                if(storedQuizzes[x] != null) {
                    
                    var data = storedQuizzes[x];
                    data['quiz_key'] = x;
                    
                    app.log("sending stored quiz-----------------------");
                    //app.log(data);
                    app.api.GravityBrain.sendAttemptQuiz(data, app.classes.QuizStorage.sendStoredQuizHandler);    
                }
            }
        } else {
            app.log("no quizzes to send");
        }
    },
    sendStoredQuizHandler : function(response) {
        app.log("receiving stored quiz-----------");
        //app.log(response);

        app.log(response);
        if(response.success) {
            
            var storedQuizzes = app.utilities.Storage.get("stored_quizzes");  
            var quizKey = response.data.quiz_key;
            delete storedQuizzes[quizKey];
            app.utilities.Storage.store("stored_quizzes", storedQuizzes);              
        } else if (!response.success){
            var storedQuizzes = app.utilities.Storage.get("stored_quizzes");  
            var quizKey = response.data.quiz_key;
            delete storedQuizzes[quizKey];
            app.utilities.Storage.store("stored_quizzes", storedQuizzes);              
        }
    }
    
});