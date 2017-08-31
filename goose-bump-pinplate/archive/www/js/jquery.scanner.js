(function($) {
	$.extend({
		scanner : function(captureCallback) {
			var croppedCords;
			var dataURL;
			var scope = {};

			$("body").animate({
				"scrollTop" : 0
			});

			$('.scan-type-button, .crop-area, .confirm-crop-button, .crop-image-title, .rescan-button, .scan-preview').hide();
			$("#webcam-preview, #scan-preview, #scan-message").html("");

			function processImage(bytes, errorCallback, captureType, isBarcode) {
				$('body').loadingOverlay();

				$("#webcam-preview, .confirm-scan-button").hide();
				if (!isBarcode) {

					var uniqueId = guid();
					$('.scan-preview').html("<img src='" + bytes + "' id='" + uniqueId + "' style='width:280px;display:none;' />");

					function scanCallback(scannedText) {
						if (scannedText != "") {
							$("#scan-preview").show();
							$("#scan-message").html("<br/><div class='scan-success'>Scan successfully processed.</div>");
							captureCallback(scannedText);
						} else {
							$("#scan-preview").show();
							$("#scan-message").html("<br/><div class='scan-error'>Can not read scan. Please try again.</div>");
							if (errorCallback) {
								errorCallback();
							}
						}
						$('body').loadingOverlay('remove');
					}

					var readers = window.App.barCodeTypes;
					var settings = window.localStorage.getItem("app-settings");
					if (settings != null) {
						settings = $.parseJSON(settings);
						if (settings['bar-code-types']) {
							readers = settings['bar-code-types'];
						}
					}
				}

				switch(captureType) {
				case "bar":
					scanCallback(bytes);
					break;
				default:
					$('#' + uniqueId).load(function() {
						OCR.decode(bytes, scanCallback, function() {
							scanCallback("");
						});
					});
					break;
				}

				$("#rescan-button").show().unbind("click").click(function() {
					$(".image_preview").val("");
					$.scanner(captureCallback);
				});
			}

			fileInputWebCam(processImage);
		}
	});
})(jQuery);
