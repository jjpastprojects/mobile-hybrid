var OCR = {
	decode : function(bytes, callback, errorCallback) {
		//$("body").append("<img src='" + bytes + "' />");
		if (window.navigator.onLine) {
			var byteString = Base64.decode(bytes.split(',')[1]);
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			var formData = new FormData();
			formData.append("file", new Blob([ab], {
				type : "image/jpeg"
			}), "scan.jpg");
			formData.append("language", "eng");
			formData.append("apikey", "helloworld");
			jQuery.ajax({
				url : BASE_OCR_FULL_URL,
				data : formData,
				timeout : 30000,
				dataType : 'json',
				cache : false,
				contentType : false,
				processData : false,
				type : 'POST',
				error : function(jqXHR,  textStatus,  errorThrown) {
					errorCallback("Error uploading for ocr recognition. <br/>" +
					"STATUS: " + textStatus + "<br/>" + 
					"Error Thrown: " + (errorThrown ? errorThrown : "unknown"));
				},
				success : function(data) {
					//console.log(data);
					if (data.ParsedResults && data.ParsedResults.length > 0 && data.ParsedResults[0].ParsedText) {
						callback(data.ParsedResults[0].ParsedText);
					}else if (data.ParsedResults && data.ParsedResults.length > 0 && data.ParsedResults[0].ErrorMessage) {
						callback(data.ParsedResults[0].ErrorMessage);
					} else {
						errorCallback("Unable to read image. Please try again.");
					}
				}
			});
		} else {
			errorCallback(window.Labels.internetConnectionError);
		}
	}
};
