var OCR = {
	decode : function(bytes, callback, errorCallback) {
		var byteString = Base64.decode(bytes.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var formData = new FormData();
		formData.append("file", new Blob([ab], {type:"image/jpeg"}), "scan.jpg");
		formData.append("language", "eng");
		formData.append("apikey", "helloworld");
		jQuery.ajax({
			url : BASE_OCR_FULL_URL,
			data : formData,
			dataType : 'json',
			cache : false,
			contentType : false,
			processData : false,
			type : 'Post',
			success : function(data) {
				if(data.ParsedResults.length > 0){
					callback(data.ParsedResults[0].ParsedText);
				}else{
					errorCallback("");
				}
			}
		});
	}
};
