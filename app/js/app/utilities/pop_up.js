app.registerUtility("PopUp", {
	showWithHTML : function(options) {
		
		var html = options.html;
		var width = options.width;
		var height = options.height;
		var closeable = options.closeable;
		var callback = options.callback;
		
		jQuery.fn.popup('start',{"content" : html, "endSize" : {"width": width, "height": height }, "animationCallback" : callback, "closeable" : closeable});
	},
	showWithTemplate : function(options) {		
		options.html = app.utilities.Templates.retrieve(options.template, {});		
		app.utilities.PopUp.showWithHTML(options);
	},
	close : function() {
		$.fn.popup('close');	
	}
});