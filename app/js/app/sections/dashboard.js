app.registerSection("Dashboard", {
	uploadBound : false,
	load : function() {
        
       $("#for_parents_container").hide(); 
		app.sections.Dashboard.uploadBound = false;
        
        
		app.utilities.Templates.load("dashboard", "main", {"user" : app.classes.GravityBrainUser.getUser()});
		app.sections.Dashboard.initDashboard();
		$("#top_menu").show();
        $("#languages_container").hide();
	},
	initDashboard : function() {
		app.sections.Dashboard.loadClassroomList();
		$("#logout_button").show();
		$("#logout_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
				app.utilities.Security.logout();
				
			});
		$("#main_menu_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
																			
				app.sections.Dashboard.load();
				
			});
		//app.sections.Dashboard.initUpdateAvatarButton();
	},
	loadClassroomList : function() {
		app.api.GravityBrain.getCourses({}, app.sections.Dashboard.loadClassroomListHandler);	
	},
	loadClassroomListHandler : function(response) {
		var data = response.data;
		if(data.courses) {
			for(x in data.courses) {				
				$("#classroom_list_inner").append(app.utilities.Templates.retrieve("classrom_list_item", data.courses[x]));	
					
			}
		}
		app.sections.Dashboard.initClassroomButtons();
	},
	initClassroomButtons : function() {
		var classroomId, courseId;
		$(".classroom_list_item").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
				classroomId = $(this).data("classroom_id");
				courseId = $(this).data("course_id");
				var data = {"class_id" : classroomId};
				app.api.GravityBrain.getCourseSchema(data, app.sections.Dashboard.getCourseHandler);
				
			});
	},
	initUpdateAvatarButton : function() {
		$("#update_user").on("click", function() {				
				app.sections.User.load();
			});
	},
	getCourseHandler : function(response) {
		if(response.success) {
			app.sections.Classroom.load(response.data.classroom);
		} else {
			
		}
	},
	
	
});