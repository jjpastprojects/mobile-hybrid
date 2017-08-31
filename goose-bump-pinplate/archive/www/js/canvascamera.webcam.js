function canvasCamera(processImage) {
	$('body').loadingOverlay();
	$.template("native.webcam", {}, function(html) {
		$("#webcam-preview").show().html(html);
		
		var captureType = "bar";
		var objCanvas = document.getElementById("scan-area");
		objCanvas.width = 280;
		objCanvas.height = 220;

		window.plugin.CanvasCamera.initialize(objCanvas);

		window.plugin.CanvasCamera.start({
			quality : 100,
			destinationType : CanvasCamera.DestinationType.FILE_URI,
			encodingType : CanvasCamera.EncodingType.JPEG,
			width : 280,
			height : 220,
			sourceType : CanvasCamera.PictureSourceType.CAMERA,
			correctOrientation : true,
			saveToPhotoAlbum : true
		});

		$(".scan-type-button.small").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			$(".pressed").removeClass("pressed");
			$(this).addClass("pressed");
		});
		$("#confirm-scan-button").unbind("click").click(function() {
			processImage(objCanvas.toDataURL("image/jpeg", 1.0), function() {
				//if error
			}, captureType);
		});

		$(".scan-type-button.large").hide();

		setTimeout(function() {
			$(".scan-type-button.small, .scan-area, .confirm-scan-button").show();
			$('body').loadingOverlay('remove');
		}, 2500);
	});
}
