// JavaScript Document

app.registerSection("User", {
	passwordChanged : null,
	load : function() {
		//app.log(app.classes.GravityBrainUser.user);
		app.utilities.Templates.load("user", "main", {"user" : app.classes.GravityBrainUser.getUser(), "languages" : app.utilities.Languages.languageList});	
		$("#top_menu").show();
		app.sections.User.initForm();
		
		if(!IS_MOBILE) {
			$(".update_avatar").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
					app.sections.User.updateAvatar();
					return false;
				});
		} else {
			$("#update_avatar").hide();	
		}
		
	},
	initForm : function() {

		$("#birthday").val(Date.create($("#birthday").val()).format('{MM}/{dd}/{yyyy}'));
		
		$("#gender").val($("#gender").data("value"));
		
		$("#langauge").val(app.utilities.Languages.currentLanguage);
		
		app.utilities.Form.datePicker("#birthday");
		
		$("#update_user").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
				var user = {};
				user.firstname = $("#firstname").val();
				user.lastname = $("#lastname").val();
				user.email = $("#email").val();
				user.gender = $("#gender").val();
				user.birthday = $("#birthday").val();
				user.language = $("#language").val();
				if(user.firstname == "") {
					$("#firstname").addClass("form_error");	
					return;
				}
				if(user.lastname == "") {
					$("#lastname").addClass("form_error");	
					return;
				}
				if(user.email == "") {
					$("#email").addClass("form_error");	
					return;
				}
				if(user.birthday) {
					user.birthday = Date.create(user.birthday).format('{yyyy}-{MM}-{dd}')	
				}
				app.log(user);
				
				app.api.GravityBrain.updateUser(user, app.sections.User.update_user_handler);
				
			});
		$("#change_password").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
				app.sections.User.change_password();												   
			});
	},
	
	update_user_handler : function(response) {
		if(response.success) {
			var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("General", "ok"), "width" : 600, "height": 200, "buttons" : [ {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : null}]});
		} else if(response.messages.failed_update)  {
			var actionBox = new ActionBox({"text" : response.messages.failed_update, "width" : 600, "height": 200, "buttons" : [ {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : null}]});	
		} else if(response.messages.no_auth) {
			var actionBox = new ActionBox({"text" : app.utilities.Languages.getValue("Login", "prompt"), "width" : 600, "height": 200, "buttons" : [ {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : function() {location.reload();}}]});	
		}
	},
	updateAvatar : function() {
		
		var actionBox = new ActionBox({ "template" : "edit_image", "width" : 600, "height": 300, "buttons" : [{"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : app.sections.User.load}]});
		/*$("#cancel_avatar_update").unbind(CLICK_EVENT, function(e) {
					e.preventDefault();
					$("#avatar_update").hide();
					$("#avatar").show();					
					return false;							
				});*/
			$("#upload_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function(e) {
					e.preventDefault();
					$("#image_input").uploadifive('upload');
					return false;
				});
		
		
			$("#image_input").uploadifive({
				'multi'			   : false,
				'auto'             : true,
				'formData'         : {
										"json" : true
									},
				'queueID'          : 'image_queue',
				'uploadScript'     : UPLOAD_AVATAR_URL,
				'onUploadComplete' : function(file, response) {
												response = jQuery.parseJSON( response );
												if(response.success) {
													app.classes.GravityBrainUser.updateAvatar(response.data.avatar);
													
												}
											}
			});	
		 /*$('#target').Jcrop({
		  bgFade:     true,
		  bgOpacity: .2,
		  setSelect: [ 60, 70, 540, 330 ]
		},function(){
		  jcrop_api = this;
		});*/
	},
	change_password : function() {				
		var actionBox = new ActionBox({"close_after_onclick" : false, "template" : "change_password", "width" : 600, "height": 300, "buttons" : [{"id" : "cancel", "value" : app.utilities.Languages.getValue("General", "cancel"), "onclick" : app.utilities.PopUp.close}, {"id" : "update", "value" : app.utilities.Languages.getValue("General", "update"), "onclick" : app.sections.User.update_password}]});
		
	},
	update_password : function() {
		var data = {};
		var newPassword = $("#password").val();
		var newPasswordRepeat = $("#password_repeat").val();
		
		if(newPassword != newPasswordRepeat) {
			$("#password_repeat").addClass("form_error");
			return;
		}
		data['old'] = app.utilities.Security.password;
		data['new'] = newPassword;
		app.sections.User.passwordChanged = newPassword;
		app.api.GravityBrain.changePassword(data, app.sections.User.update_password_handler);
		
	},
	update_password_handler : function(response) {
		if(response.success) {
			app.classes.GravityBrainUser.updatePassword	(app.sections.User.passwordChanged);
			app.utilities.PopUp.close();
			var actionBox = new ActionBox({ "text" : app.utilities.Languages.getValue("ChangePasswordPopup", "passwordChanged"), "width" : 600, "height": 300, "buttons" : [ {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : null}]});
		} else {
			app.utilities.PopUp.close();
			var actionBox = new ActionBox({ "text" : app.utilities.Languages.getValue("ChangePasswordPopup", "errorChangingPassword"), "width" : 600, "height": 300, "buttons" : [ {"id" : "ok", "value" : app.utilities.Languages.getValue("General", "ok"), "onclick" : null}]});
			
		}
	}
					
});