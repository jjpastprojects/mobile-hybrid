HTML5_Camera = {
	videoElement : null,
	cameras : null,
	intervalSet : false,
	start : function(videoElement, videoSelect, callback, delay) {
		$('body').loadingOverlay();

		HTML5_Camera.videoElement = videoElement;

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		function gotSources(sourceInfos) {
			HTML5_Camera.cameras = [];
			for (var i = 0; i !== sourceInfos.length; ++i) {

				var sourceInfo = sourceInfos[i];
				if (sourceInfo.kind == "video") {
					var option = document.createElement('option');
					option.value = sourceInfo.id;
					option.text = (sourceInfo.label || ("" + (videoSelect.length + 1))).toUpperCase();
					videoSelect.appendChild(option);
					HTML5_Camera.cameras.push(sourceInfo);
				}
			}

			var savedCamera = window.localStorage.getItem("camera");
			if (savedCamera != null) {
				$(videoSelect).val(savedCamera);
			}

			start();

		}

		if ( typeof MediaStreamTrack !== 'undefined' && typeof MediaStreamTrack.getSources !== 'undefined') {
			MediaStreamTrack.getSources(gotSources);
		} else {
			start();
		}

		function successCallback(stream) {
			window.stream = stream;
			videoElement.src = window.URL.createObjectURL(stream);
			videoElement.play();
			callback(HTML5_Camera.cameras);
			$('body').loadingOverlay('remove');

			if (!HTML5_Camera.intervalSet) {
				$("#capture-resizeable").fadeIn();
				alignTo();
				setInterval(function() {
					$("#capture-resizeable").fadeOut('slow', function() {
						$("#capture-resizeable").fadeIn('fast');
					});
				}, 1000);
				HTML5_Camera.intervalSet = true;
			}
		}

		function start() {
			HTML5_Camera.stop(videoElement);
			var videoSource = videoSelect.value;

			var constraints = {
				video : {
					optional : [{
						sourceId : videoSource
					}]
				}
			};
			navigator.getUserMedia(constraints, successCallback, function() {
				$('body').loadingOverlay('remove');
			});
		}


		videoSelect.onchange = start;
		$(videoSelect).change(function() {
			var videoSource = $(this).val();
			window.localStorage.setItem("camera", videoSource);
		});

		var postion = $(".html5-scan-area").position();
		var containment = [postion.left, postion.top, postion.left, postion.top];

		$("#capture-resizeable").resizable({
			maxHeight : 210,
			maxWidth : 275,
			handles : "n, e, s, w"
		});

		function alignTo() {
			$("#capture-resizeable").css({
				left : postion.left - 10,
				top : postion.top
			});
		}

		alignTo();

		$(window).on("orientationchange", alignTo);
	},
	stop : function() {
		if (window.stream && HTML5_Camera.videoElement != null) {
			HTML5_Camera.videoElement.src = null;
			window.stream.getVideoTracks()[0].stop();
		}
	},
	snapshot : function(callback) {
		function manageNegitiveNumber(number) {
			if (number < 0) {
				return 0;
			} else {
				return number;
			}
		}

		var videoPosition = $("#capture-video").offset();
		var capturePosition = $("#capture-resizeable").offset();
		var canvas = document.createElement('canvas');

		canvas.width = $("#capture-resizeable").width();
		canvas.height = $("#capture-resizeable").height();
		var ctx = canvas.getContext('2d');

		ctx.drawImage(HTML5_Camera.videoElement, -manageNegitiveNumber(capturePosition.left - videoPosition.left), -manageNegitiveNumber(capturePosition.top - videoPosition.top), $("#capture-resizeable").width() + manageNegitiveNumber(capturePosition.left - videoPosition.left), $("#capture-resizeable").height() + manageNegitiveNumber(capturePosition.top - videoPosition.top));

		var dataURI = canvas.toDataURL('image/jpeg', 1.0);
		//$("body").append("<img src='" + dataURI + "' />");
		callback(dataURI);
	}
};
