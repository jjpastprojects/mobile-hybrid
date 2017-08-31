(function($) {
	$.extend({
		template : function(tpl, data, callback) {
			$.get("./tpl/" + tpl + ".tpl", function(str){
				for(var key in data){
					str = replaceAll(":" + key + ":", data[key], str);
				}
				callback(str);
			});
		}
	});
})(jQuery); 