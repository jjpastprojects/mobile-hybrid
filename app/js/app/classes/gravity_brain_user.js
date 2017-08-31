app.registerClass("GravityBrainUser", {
	id : null,
	name : null,
	user : null,
	settings : null,
	
	set : function(user) {
		
		if(user) {
			app.classes.GravityBrainUser.user = user;
			/*
			if(user.id) {
				app.classes.GravityBrainUser.id = user.id;	
			}
			if(user.name) {
				app.classes.GravityBrainUser.name = user.name;	
			}
			if(user.settings) {
				app.classes.GravityBrainUser.settings = user.settings;	
			}
			*/
		}
		
		
	},
    getUser : function() {
        var user = app.classes.GravityBrainUser.setDefaultAvatar(app.classes.GravityBrainUser.user);
        return user;
    },
    getUserId : function() {
        return app.classes.GravityBrainUser.user.usr_id;  
    },
    setDefaultAvatar : function(user) {
        if(!user.avatar) {
            user.avatar = DEFAULT_AVATAR;   
        }   
        return user; 
    },
    
	setOneClickUser : function(user) {
	    user = app.classes.GravityBrainUser.setDefaultAvatar(user);
		var firstName = (user.usr_firstname)? user.usr_firstname : user.username;
       
		var storeData = {'username' : user.username, 'password' : app.utilities.Security.password, 'avatar' : user.avatar, 'first_name' : firstName, "user_id" : user.usr_id, "auth_token" : user.auth_token};
		var oneClickUsers = app.utilities.Storage.get("one_click_users");
		var found = false;
		if(oneClickUsers) {
			for(u in oneClickUsers) {
				if(u == user.username) {
					oneClickUsers[u] = 	storeData;
					found = true;
					app.log("true");
				}
			}
		} else {
			oneClickUsers = {};	
		}
		if(!found) {
			app.log("false");
			oneClickUsers[user.username] = 	storeData;
		}
		app.log("ocu");
		app.log(oneClickUsers);
		app.utilities.Storage.store("one_click_users", oneClickUsers);
		
	},
	getOneClickUser : function(username) {
		var oneClickUsers = app.utilities.Storage.get("one_click_users");
		for(u in oneClickUsers) {
			if(u == username) {
				return oneClickUsers[u];
			}
		}
	},
	setSetting : function (id, value) {
		
	},
	setSettingHandler : function(response) {
		if(response.success) {
			if(response.user){
				if(response.settings){
					app.classes.GravityBrainUser.settings = response.settings;	
				}
			}
		} else {
			// TODO
		}		
	},
	getCurrentUserFromStorage : function() {		
		return app.classes.GravityBrainUser.getOneClickUser(app.classes.GravityBrainUser.user.username);
	},
	updateAvatar : function(avatar) {
		var user = app.classes.GravityBrainUser.getCurrentUserFromStorage();
		if(user) {			
			user.avatar = avatar;
			app.classes.GravityBrainUser.setOneClickUser(user);						
		}
	},
    updateUser : function(user) {       
		
       var oneClickUsers = app.utilities.Storage.get("one_click_users");
		var found = false;
		if(oneClickUsers) {
			for(u in oneClickUsers) {
				if(u == user.username) {
					oneClickUsers[u].avatar = user.avatar;
                    oneClickUsers[u].auth_token = user.auth_token;
					found = true;
				}
			}
		}
       app.utilities.Storage.store("one_click_users", oneClickUsers);
        
    },
	updatePassword : function(password) {
		var user = app.classes.GravityBrainUser.getCurrentUserFromStorage();
		app.utilities.Security.password = password;
		if(user) {			
			user.password = password;
			app.classes.GravityBrainUser.setOneClickUser(user);						
		}
	}
				  
});
