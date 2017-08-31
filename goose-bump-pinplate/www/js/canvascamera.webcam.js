function canvasCamera(processImage) {
	$('body').loadingOverlay();
	$.template("native.webcam", {}, function(html) {

		$("#webcam-preview").show().html(html);
		$("[data-type='bar']").html(window.Labels.scanTypeButtonBarCodeLabel);
		$("[data-type='vin']").html(window.Labels.scanTypeButtonVINLabel);
		$("[data-type='plate']").html(window.Labels.scanTypeButtonPlateLabel);

		var captureType = "bar";
		var objCanvas = document.getElementById("scan-area");
		$(objCanvas).css({
			width : "280px",
			height : "220px",
			background : "black"
		});
		objCanvas.width = 280;
		objCanvas.height = 220;

		window.plugin.CanvasCamera.initialize(objCanvas);

		window.plugin.CanvasCamera.start({
			quality : 70,
			destinationType : CanvasCamera.DestinationType.FILE_URI,
			encodingType : CanvasCamera.EncodingType.JPEG,
			width : 280,
			height : 220,
			sourceType : CanvasCamera.PictureSourceType.CAMERA,
			correctOrientation : true,
			saveToPhotoAlbum : true
		});

		window.plugin.CanvasCamera.setCameraPosition(CanvasCamera.CameraPosition.BACK);

		$(".scan-type-button.small").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			$(".pressed").removeClass("pressed");
			$(this).addClass("pressed");
		});
		$("#confirm-scan-button").unbind("click").click(function() {
			flashOverlay($(objCanvas), function() {
				processImage(objCanvas.toDataURL("image/jpeg", 0.5), function() {
					//if error
				}, captureType, false);
			});
		});

		$(".scan-type-button.large").hide();

		$(".scan-type-button.small, .scan-area, .confirm-scan-button").show();
		$('body').loadingOverlay('remove');
	});
}
