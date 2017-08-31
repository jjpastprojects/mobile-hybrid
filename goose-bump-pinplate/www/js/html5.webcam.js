function html5WebCam(processImage) {
	$('body').loadingOverlay();
	$.template("html5.webcam", {}, function(html) {
		$("#webcam-preview").show().html(html);
		$("[data-type='bar']").html(window.Labels.scanTypeButtonBarCodeLabel);
		$("[data-type='vin']").html(window.Labels.scanTypeButtonVINLabel);
		$("[data-type='plate']").html(window.Labels.scanTypeButtonPlateLabel);

		var captureType = "bar";

		$('.webcam-sector select').html("");
		var $video = $('#html5-scan-area video');
		var $videoSelect = $('.webcam-sector select');
		$('#html5-scan-area, .scan-type-button.small').show();
		HTML5_Camera.start($video[0], $videoSelect[0], function(cameras) {
			if (cameras != null && cameras.length > 1) {
				$('.webcam-sector').show();
			}
		}, 0);

		$(".scan-type-button.small").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			$(".pressed").removeClass("pressed");
			$(this).addClass("pressed");
		});

		$("#confirm-scan-button").unbind("click").click(function() {
			flashOverlay($('#html5-scan-area'), function() {
				HTML5_Camera.snapshot(function(dataUrl) {
					//console.log(dataUrl);
					processImage(dataUrl, function() {
						//	HTML5_Camera.stop();
					}, captureType);
				});
			});
		});

		$(".scan-type-button.large").hide();

		$(".scan-type-button.small, .confirm-scan-button").show();
		$('body').loadingOverlay('remove');
		
		
	});
}
