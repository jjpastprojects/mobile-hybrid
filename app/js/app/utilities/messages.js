app.registerUtility("Messages", {		
		showMessage : function(message) {
			$("#messages_container").show();
			$("html, body").animate({ scrollTop: 0 }, "fast");	
			$("#messages_container").css("margin-top",0);
			$("#messages_container_inner").append('<div  >' + message + '<div>');	
			var hide_message_timeout = setTimeout("app.utilities.Messages.hideMessage();", 1000);
		},
		hideMessage : function() {
			
			$("#messages_container").fadeOut(5000, function () {
					$("#messages_container_inner").html("");										 
				});
		}
	});