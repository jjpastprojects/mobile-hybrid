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
					//if error
				}, captureType, false);
			}, function() {

			}, {
				quality : 50,
				destinationType : Camera.DestinationType.DATA_URL
			});
		}

		function scanBarCode() {
			cordova.plugins.barcodeScanner.scan(function(result) {
				processImage(result.text, function() {
					//if error
				}, captureType, true);
			}, function(error) {
				//if error
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

			/*$("#webcam-preview").append("<input type='file' style='display:none;'/>");
			 $("#webcam-preview input").change(function(e) {
			 var files = (e.target.files || e.dataTransfer.files);
			 var file = files[0];
			 var reader = new FileReader();
			 reader.onload = function(e) {
			 processImage(e.target.result, function() {
			 //if error
			 }, captureType);
			 };
			 reader.readAsDataURL(file);
			 });
			 $("#webcam-preview input").trigger("click");*/
		});

		$(".scan-type-button.large").show();
		$(".scan-type-button.small, .confirm-scan-button").hide();
		$('body').loadingOverlay('remove');
	});
}
