(function($) {
	$.extend({
		oAuth2Token : null,
		expiresTimeout : null,
		getLoginDetails : function() {
			var username = window.localStorage.getItem("username");
			var password = window.localStorage.getItem("password");
			if (username == null || username == "") {
				username = "-1";
			}

			if (password == null || password == "") {
				password = "-1";
			}
			return {
				password : password,
				username : username
			};
		},
		getOAUTH2Token : function(callback, errorBack) {

			if ($.oAuth2Token != null) {
				callback($.oAuth2Token.access_token);
				return;
			}

			var loginDetails = $.getLoginDetails();
			$.ajaxProxy({
				url : BASE_OAUTH2_TOKEN_URL,
				type : "POST",
				data : {
					"username" : loginDetails['username'],
					"password" : loginDetails['password'],
					"grant_type" : "password"
				},
				xhrFields : {
					withCredentials : true
				},
				headers : {
					"Authorization" : "Basic " + btoa("rtlsapp" + ":" + "rfinspired")
				},
				callback : function(response) {
					if (response.access_token) {
						$.oAuth2Token = response;
						callback(response.access_token);
						setTimeout(function() {
							$.oAuth2Token = null;
						}, parseInt(response.expires_in) * 90);
					}else{
						errorBack();
					}
				},
				errorBack:errorBack
			}, false, true);
		},
		ajaxOAUTH2Proxy : function(options, hideLoader, customURL) {
			$.getOAUTH2Token(function(token) {
				options.token = token;
				$.ajaxProxy(options, hideLoader, customURL);
			});
		}
	});

})(jQuery);
