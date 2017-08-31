(function($) {
	$.extend({
		scanner : function(captureCallback) {
			var croppedCords;
			var dataURL;
			var scope = {};
			var nativeSupported = ( typeof (window.plugin) != "undefined" && typeof (window.plugin.CanvasCamera) != "undefined");

			$("body").animate({
				"scrollTop" : 0
			});

			$('.scan-type-button, .crop-area, .confirm-crop-button, .crop-image-title, .rescan-button, .scan-preview').hide();
			$("#webcam-preview, #scan-preview, #scan-message").html("");

			function processImage(bytes, errorCallback, captureType, isBarCode) {
				$('body').loadingOverlay();
				$("#scan-message").html("");

				function scanCallback(scannedText, message) {
					$('body').loadingOverlay('remove');
					if (scannedText != "") {
						//	$("#scan-preview").show();
						quickMessage('Scan successfully processed.', "success");
						captureCallback(scannedText, captureType);
					} else {
						//	$("#scan-preview").show();
						quickMessage(( message ? message : "Can not read scan. Please try again."), "failure");
						if (errorCallback) {
							errorCallback();
						}
					}
				}

				switch(captureType) {
				case "bar":
				case "vin":
					var readers = window.App.barCodeTypes;
					var settings = window.localStorage.getItem("app-settings");
					if (settings != null) {
						settings = $.parseJSON(settings);
						if (settings['bar-code-types']) {
							readers = settings['bar-code-types'];
						}
					}

					//	console.log(readers);
					Quagga.decodeSingle({
						inputStream : {
							constraints : {
								width : 280,
								height : 220,
								facing : "environment"
							},
							area : {
								top : "0%",
								right : "0%",
								left : "0%",
								bottom : "0%"
							}
						},
						tracking : false,
						debug : false,
						controls : false,
						locate : true,
						numOfWorkers : 4,
						locator : {
							patchSize : "large",
							halfSample : false
						},
						decoder : {
							readers : readers
						},
						src : bytes
					}, function(result) {
						//console.log(result);
						if (result && result.codeResult && result.codeResult.code) {
							scanCallback(result.codeResult.code);
						} else {
							scanCallback("");
						}
					});
					break;
				default:
					OCR.decode(bytes, scanCallback, function(message) {
						scanCallback("", message);
					});
					break;
				}
			}

			if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
				html5WebCam(processImage);
			} else {
				fileInputWebCam(processImage);
			}
		}
	});
})(jQuery);
