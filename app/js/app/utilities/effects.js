// JavaScript Document

app.registerUtility("Effects", {
	init : function() {
		app.utilities.Effects.initHoverImage();
	},
	initHoverImage : function() {
		$(document).on(MOUSE_OVER, HOVER_IMAGE_SELECTOR, function() {
				var activeImage = $(this).data("active-state");
				$(this).attr("src",activeImage); 
				
			});
		$(document).on(MOUSE_OUT, HOVER_IMAGE_SELECTOR, function() {
				var inactiveImage = $(this).data("inactive-state");
				$(this).attr("src",inactiveImage); 
				
			});
	}
});