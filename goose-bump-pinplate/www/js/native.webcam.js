function nativeWebCam(processImage) {
	var captureType = "bar";
	$('body').loadingOverlay();
	$.template("fileinput.webcam", {}, function(html) {
		$("#webcam-preview").show().html(html);

		$("[data-type='bar']").html(window.Labels.scanTypeButtonBarCodeLabel);
		$("[data-type='vin']").html(window.Labels.scanTypeButtonVINLabel);
		$("[data-type='plate']").html(window.Labels.scanTypeButtonPlateLabel);

		function takePicture() {
			navigator.camera.getPicture(function(imageData) {
				processImage("data:image/jpeg;base64," + imageData, function() {
					$('body').loadingOverlay('remove');
				}, captureType, false);
			}, function() {
				$('body').loadingOverlay('remove');
			}, {
				quality : 70,
				destinationType : Camera.DestinationType.DATA_URL
			});
		}

		function scanBarCode() {
			cordova.plugins.barcodeScanner.scan(function(result) {
				processImage(result.text, function() {
					$('body').loadingOverlay('remove');
				}, captureType, true);
			}, function(error) {
				$('body').loadingOverlay('remove');
			});
		}

		$(".scan-type-button.large").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			switch(captureType) {
			case "bar":
				scanBarCode();
				break;
			default:
				takePicture();
				break;
			}
		});

		$(".scan-type-button.large").show();
		$(".scan-type-button.small, .confirm-scan-button").hide();
		$('body').loadingOverlay('remove');
	});
}
