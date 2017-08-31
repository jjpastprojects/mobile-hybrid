window.loadingTimeout = null;

(function($) {
	$.fn.extend({
		loadingOverlay : function(cmd, message, messageType) {
			var $this = $(this);
			if ( typeof (window.loadingQueSize) == "undefined") {
				window.loadingQueSize = 0;
			}

			function setSize() {
				$('.loading').css({
					width : $(window).width(),
					height : $(window).height()
				});
			}

			function removeLoader() {
				if(window.loadingTimeout != null){
					clearTimeout(window.loadingTimeout);
					window.loadingTimeout = null;
				}
				$(".loading").remove();
				$("html, body").removeClass("overflow-hidden");
				window.loadingQueSize = 0;
				$(window).unbind('resize', setSize);
			}

			if (cmd && cmd == 'remove') {
				window.loadingQueSize--;
				//console.log(window.loadingQueSize);
				if (window.loadingQueSize <= 0) {
					removeLoader();
				}
			} else if(cmd && cmd == 'update' && message){
				$(".loading .message").html(message);
				if(messageType && messageType == "error"){
					$(".loading .message").css("color", "red");
				}
			}else {
				window.loadingQueSize++;
				//console.log(window.loadingQueSize);
				if ($(".loading").length == 0) {
					window.loadingTimeout = setTimeout(removeLoader, 20000);
					$('body').append("<div class='loading'><div class='spinner'></div><div class='message'></div></div>");

					$("html, body").addClass("overflow-hidden");
					$(window).resize(setSize);
					setSize();
				}
			}
		}
	});
})(jQuery);
