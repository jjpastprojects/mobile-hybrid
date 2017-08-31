(function($) {
	$.extend({
		ajaxProxy : function(options, hideLoader, customURL) {
			options.cache = false;
			options.async = true;
			options.crossDomain = true;

			if (customURL) {
				options.url = options.url;
			} else {
				options.url = BASE_FULL_URL + options.url;
			}

			options.type = options.type ? options.type : 'get';
			options['content-type'] = 'x-www-form-urlencoded';

			if (options.token) {
				options.headers = {
					"Authorization" : "bearer " + options.token
				};
			}
			options.timeout =  20000;
			
			$.ajax(options).then(function(data, status, extra) {
				if (options.callback) {
					options.callback(data, status, extra);
				};
			}, function(a, b, c) {
				if (options.errorBack) {
					options.errorBack();
				} else {
					quickMessage("There was an unexpected error with this request. Please check your internet connection before continuing.");
				}
			});
		}
	});

})(jQuery);
