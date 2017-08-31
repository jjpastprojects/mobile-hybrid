(function() {
	isIOS = function() {
		return (/iPad|iPhone|iPod/.test(navigator.platform));
	};
})();

(function() {
	quickMessage = function(html, type) {
		type = type && type != "" ? type : "logo";
		$('[data-role="page"]').css("opacity", ".6");
		html = "<table style='width:100%;'><tr><td></td><td style='width:75%;'>" + html + "</td><td></td></tr></table>"; 
		$("#quickMessage").addClass(type).html(html).fadeIn(function() {
			function removeMessage() {
				$("#quickMessage").fadeOut('fast', function() {
					$("#quickMessage").html("");
				});
				$('[data-role="page"]').css("opacity", "1.0");
				$(document).unbind('click touchstart', unbindBody);
				clearTimeout(realignTimeout);
			}

			function unbindBody() {
				clearTimeout(messageTimeout);
				removeMessage();
			}

			var messageTimeout = setTimeout(removeMessage, 6000);
			var realignTimeout = setInterval(function(){
				//console.log($("body").scrollTop());
				//console.log($(window).scrollTop());
				$("#quickMessage").css({
					"top" : $(window).scrollTop()
				});
			}, 10);
			$(document).bind('click touchstart', unbindBody);
			
		});
	};
	
})();

(function() {
	writeScript = function(src) {
		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", src);
		document.getElementsByTagName("head")[0].appendChild(script);
		return script;
	};
})();

(function() {
	convertImageToCanvas = function(image) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext("2d").drawImage(image, 0, 0);

		return canvas;
	};
})();

(function() {
	resizeBytes = function(base64, maxWidth, maxHeight) {
		// Max size for thumbnail
		if ( typeof (maxWidth) === 'undefined')
			var maxWidth = 500;
		if ( typeof (maxHeight) === 'undefined')
			var maxHeight = 500;
		try {
			// Create and initialize two canvas
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var canvasCopy = document.createElement("canvas");
			var copyContext = canvasCopy.getContext("2d");

			// Create original image
			var img = new Image();
			img.src = base64;

			// Determine new ratio based on max size
			var ratio = 1;
			if (img.width > maxWidth)
				ratio = maxWidth / img.width;
			else if (img.height > maxHeight)
				ratio = maxHeight / img.height;

			// Draw original image in second canvas
			canvasCopy.width = img.width;
			canvasCopy.height = img.height;
			copyContext.drawImage(img, 0, 0);

			// Copy and resize second canvas to first canvas
			canvas.width = img.width * ratio;
			canvas.height = img.height * ratio;
			ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);

			return canvas.toDataURL();
		} catch(e) {
			return base64;
		}

	};
})();

(function() {
	scaleImage = function(img) {
		return convertImageToCanvas(img).toDataURL('image/jpeg', .5);
	};
})();

(function() {
	notLoggedIn = function(callback) {
		var loggedOutState = false;
		window.App.isLoggedIn = loggedOutState;
		callback(loggedOutState);
	};
})();

(function() {
	searchError = function() {
		alert("There was an error with your search. Please try again.");
		window.App.changeView("details", {});
	};
})();

(function() {
	forceUpperCase = function() {
		$(this).val($(this).val().toUpperCase());
	};
})();

(function() {
	returnNullString = function(str) {
		if (str == null || str == "") {
			return "null";
		} else {
			return str;
		}
	};
})();

(function() {
	guid = function() {
		function _p8(s) {
			var p = (Math.random().toString(16) + "000000000").substr(2, 8);
			return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
		};
		return _p8() + _p8(true) + _p8(true) + _p8();
	};
})();

(function() {
	replaceAll = function(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	};

})();

(function() {
	flashOverlay = function($el, callback) {
		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', 'audio/camera-flash.mp3');
		audioElement.setAttribute('autoplay', 'autoplay');
		audioElement.addEventListener("load", function() {
			audioElement.play();
		}, true);
		$("#webcam-flash").css("display", "block").fadeOut("fast", function() {
			$("#webcam-flash").css("opacity", 1).fadeOut("slow");
			callback();
		});

	};

})();

