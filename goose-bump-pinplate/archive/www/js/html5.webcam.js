function html5WebCam(processImage) {
	$('body').loadingOverlay();
	$.template("html5.webcam", {}, function(html) {
		$("#webcam-preview").show().html(html);
		$("[data-type='bar']").html(window.Labels.scanTypeButtonBarCodeLabel);
		$("[data-type='vin']").html(window.Labels.scanTypeButtonVINLabel);
		$("[data-type='plate']").html(window.Labels.scanTypeButtonPlateLabel);
		

		var captureType = "bar";

		$('#html5-scan-area').show().photobooth().on("image", function(event, dataUrl) {
			processImage(dataUrl, function() {
				$('#html5-scan-area').data("photobooth").destroy();
			}, captureType);
		});

		$('#html5-scan-area').data("photobooth").resize(280, 220);
		

		$(".scan-type-button.small").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			$(".pressed").removeClass("pressed");
			$(this).addClass("pressed");
		});

		$("#confirm-scan-button").unbind("click").click(function() {
			flashOverlay($('#html5-scan-area'), function() {
				$(".photobooth .trigger").trigger("click");
			});
		});

		$(".scan-type-button.large").hide();

		setTimeout(function() {
			$(".scan-type-button.small, .confirm-scan-button").show();
			$('body').loadingOverlay('remove');
		}, 2500);
	});
}
