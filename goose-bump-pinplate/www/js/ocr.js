var OCR = {
	decode : function(bytes, callback, errorCallback) {
		try {
			tesseractPlugin.createEvent(bytes, callback);
		} catch(e) {
			errorCallback("Unable to read image. Please try again.");
		}
	}
};
