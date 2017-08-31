app.registerUtility("Form", {
		init: function() {
          
		},
		apply: function (selector) {
			app.utilities.Form.placeHolder(selector);
			app.utilities.Form.autoGrow(selector);
           app.utilities.Form.datePicker(selector);
						
		},
		placeHolder: function (selector) {
			
			$(selector).find(':input').each(function () {
				if ($(this).attr('data-placeholder') !== undefined) {
					$(this).val($(this).attr('data-placeholder'));
					$(this).focus(function () {
						if($(this).val() == $(this).attr('data-placeholder')) {
							$(this).val("");	
						}
					});
					$(this).blur(function () {
						if($(this).val() == "") {
							$(this).val($(this).attr('data-placeholder'));	
						}
					});
				} 
										 
			});
		},
		autoGrow: function (selector) {
			$(selector).find(".auto_grow").each(function () {
				
				$(this).keypress(function (e)
				{
					var m = this.value.match(/\n/g);
					if(m!=null) {
						this.rows = (m.length+1);
					}else{
						this.rows = 2;
					}
				});	
			});
		},
		datePicker : function(selector) {
			$(selector).datepicker();
		}
									   
	});