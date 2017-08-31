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
		$("#webcam-flash").css("display", "block").fadeOut("fast", function() {
			$("#webcam-flash").css("opacity", 1).fadeOut("slow");
			callback();
		});
	};

})();

