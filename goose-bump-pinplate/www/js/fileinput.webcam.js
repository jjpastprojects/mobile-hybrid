function fileInputWebCam(processImage) {
	var captureType = "bar";
	$('body').loadingOverlay();
	$.template("fileinput.webcam", {}, function(html) {
		$("#webcam-preview").show().html(html);
		
		$("[data-type='bar']").html(window.Labels.scanTypeButtonBarCodeLabel);
		$("[data-type='vin']").html(window.Labels.scanTypeButtonVINLabel);
		$("[data-type='plate']").html(window.Labels.scanTypeButtonPlateLabel);
		
		$(".scan-type-button.large").unbind("click").click(function() {
			captureType = $(this).attr("data-type");
			var uid = guid();
			$("#webcam-preview").append("<input type='file' id='" + uid + "' capture='camera' style='display:none;'/>");
			$("#" + uid).change(function(e) {
				
				var files = (e.target.files || e.dataTransfer.files);
				var file = files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					//console.log(captureType);
					processImage(e.target.result, function() {
						//if error
					}, captureType);
				};
				reader.readAsDataURL(file);
			});
			$("#" + uid).trigger("click");
		});

		$(".scan-type-button.large").show();
		$(".scan-type-button.small, .confirm-scan-button").hide();
		$('body').loadingOverlay('remove');
	});
}
