// JavaScript Document

var BestGrades = function(_id, _bestScoreData) {
	var _this = this;
	this.id = _id;
	var marks = _bestScoreData.marks;
	var questionsTotal = _bestScoreData.total_weight;
	
	var questionsRequiredToPass = _bestScoreData.pass_weight;
	
	this.idToUpdate = "";
	
	var getPercentagePass = function() {
		
		return questionsRequiredToPass / questionsTotal;
	}
	
	var getPercentage = function(number) {
		return number / questionsTotal;
	}
	
	this.renderBestGrades = function() {
		var html = "";
		var data = {};
		data.marks = marks;
		data.marks.reverse()
		data.grade_bar_container_size = marks.length;
		if(marks) {
			if(marks.length == 3) {
				data.image = "images/classroom/best_three_grades_bar.png";
				
			} else if(marks.length == 2) {
				data.image = "images/classroom/best_two_grades_bar.png";
			} else if(marks.length == 1) {
				data.image = "images/classroom/best_single_grades_bar.png";
			}
			
			app.utilities.Templates.load("best_grades", this.id,  data);
		}
		
		var lowestMark = null;
		var lowestMarkValue = null;
		for(x in marks) {
			if(!lowestMarkValue || marks[x] < lowestMarkValue || marks[x] == -1) {
				
				lowestMark = x;
				lowestMarkValue = marks[x];
				
			}
		}
		
		var count = 0;
		$("#" + _this.id + " .grade_bar").each(function() {
				
				$(this).attr("id", "grade_bar_" + _this.id + "_" + count);
				if(count == lowestMark) {
					
					_this.idToUpdate = $(this).attr("id");	
				}
				if(marks[count] > -1) {
					
					_this.updateBestGrades($(this), marks[count], questionsTotal - marks[count]); 
				}
				count++;
			});
	}
	
	this.updateBestGradeForQuiz = function(numCorrect, numIncorrect) {
		var gradeBarDOMElement = $("#" + this.idToUpdate);
		this.updateBestGrades(gradeBarDOMElement, numCorrect, numIncorrect) 
	}
	
	
	this.updateBestGrades = function(gradeBarDOMElement, numCorrect, numIncorrect) {		
		var percentagePass = getPercentagePass();
		
		var width = gradeBarDOMElement.width();
		var leftPixels = width * percentagePass;
		
		gradeBarDOMElement.children(".pass_grade_marker").css("left",leftPixels + "px" );						
		var percentage = getPercentage(numCorrect);
		
		var pixels = percentage * width;
		
		gradeBarDOMElement.children(".correct").css("width", pixels + "px" );
		percentage = getPercentage(numIncorrect);
		
		var pixels = percentage * width;
		
		gradeBarDOMElement.children(".incorrect").css("width", pixels + "px" );
		gradeBarDOMElement.children(".incorrect").css("right", 0 + "px" );
		
	}


	
}