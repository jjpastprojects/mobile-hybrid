app.registerUtility("Templates", {
	templates : null,
	templateLoaded : {},
	areTemplatesLoaded : false,
	init : function() {
		app.utilities.Templates.templates = {};
        
		if(!jQuery.isEmptyObject(TEMPLATE_LIST)) {
			for(var name in TEMPLATE_LIST) {
				app.utilities.Templates.templateLoaded[name] = false;	
			}
			for(var name in TEMPLATE_LIST) {
				var templateLocation = TEMPLATES_DIRECTORY + "/" + TEMPLATE_LIST[name];
				
				app.utilities.Ajax.loadLocal(templateLocation, name, app.utilities.Templates.store);
			}
		} else {
			
			app.utilities.Templates.areTemplatesLoaded = true;
		}
	},
	store : function(html, name) {
		//app.log("store "  + name);
		app.utilities.Templates.templates[name] = html;
		app.utilities.Templates.templateLoaded[name] = true;
		//app.log("templates " + name + " loaded");
		for(x in app.utilities.Templates.templateLoaded) {
			if(!app.utilities.Templates.templateLoaded[x]) {
				return;
				
			}
		}
		//app.log("templates loaded");
		//app.log(app.utilities.Templates.templates);
		app.utilities.Templates.areTemplatesLoaded = true;
		
	},
	load : function(name, DOMId, data) {
		
		
		//app.log("loading template " + name + " into " + DOMId);
		var templateData = app.utilities.Templates.retrieve(name, data);
		//app.log(templateData);
		$("#" + DOMId).html(templateData);
	},
	retrieve : function(name, data) {
		data = app.utilities.Templates.addLocality(data);
		data = app.utilities.Templates.addRandom(data);
		
		if(app.utilities.Templates.templates[name]) {
			
			return 	Mustache.render(app.utilities.Templates.templates[name], data);
		}
		return "";
	},
	addLocality : function(data) {
		var locality = app.utilities.Languages.getCurrentLocality();
		
		data.lang = locality;
		return data;
	},
	addRandom : function(data) {
		
		
		data._random = Math.random();;
		return data;
	}
	
	
});
