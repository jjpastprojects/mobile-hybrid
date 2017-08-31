// JavaScript Document


var ActionBox = function(options) {
	_this = this;
	this.text = "";
	if(options.text) {
		this.text = options.text;
	}
	this.buttons = options.buttons;	
	this.width = options.width;
	this.height = options.height;
	if(options.template) {
		this.template = options.template;
	}
	if(options.html) {
		this.html = options.html;	
	}
	this.close_after_onclick = true;
    if(options.callback) {
        this.callback = options.callback;
    }
	
	if(options.close_after_onclick  === false) {
		this.close_after_onclick = options.close_after_onclick;
	} 
    
    if(options.template_data) {
        this.templateData = options.template_data;   
    } else {
        this.templateData = {};   
    }
    
    this.hasClose = true;
    if(!options.no_close === true) {
        this.hasClose = false;
    }

		
	this.render = function() {
		for(x in _this.buttons) {
			_this.buttons[x].index = x;
			
		}
		var html = app.utilities.Templates.retrieve("action_box", {"buttons" : this.buttons, "text" : this.text});
       
		
		app.utilities.PopUp.showWithHTML({"html" : html, "width" : this.width, "height" : this.height, "closeable" : false, "callback" : this.addText});
		
	}
	
    this.addText = function() {
       
        if(_this.template) {
			
			var html_template = app.utilities.Templates.retrieve(_this.template, this.templateData);	
			
			$("#action_box_text").html(html_template);
		}
		if(_this.html) {
            
			$("#action_box_text").html(_this.html);
		}
       _this.initButtons();
    }
    
	this.initButtons = function() {
		
		for(x in _this.buttons) {
			
			if(_this.buttons[x].id) {
				
				$("#" + _this.buttons[x].id).unbind(CLICK_EVENT).bind(CLICK_EVENT, function() {
						var index = $(this).data("index");
						if(_this.buttons[index].onclick) {
													
							_this.buttons[index].onclick();	
						}
						if(_this.close_after_onclick) {
							app.utilities.PopUp.close();
						}
					});
			}
		}
        if(_this.callback) {
            _this.callback();   
        }
	}
	this.render();
	
	
}