
app.registerUtility("Storage", {
		storage : null,
		init : function() {			
			app.utilities.Storage.storage = window.localStorage;			
		},
		store : function(key, value) {
			//app.log("storing " + key);
			
			value = JSON.stringify(value);
			//app.log(value);
			if(app.utilities.Storage.isLocalStorageNameSupported()) {
				app.utilities.Storage.storage.setItem(key, value);
			}
		},
		get : function(key) {
			//app.log("getting " + key);
			value = app.utilities.Storage.storage.getItem(key);
			//app.log(value);
			if(value) {
				return JSON.parse(value);	
			}
			return false;
		},
		remove :function(key) {
			app.utilities.Storage.storage.removeItem(key);
		},
		isLocalStorageNameSupported : function() {
			var testKey = 'test', storage = window.sessionStorage;
			try {
				storage.setItem(testKey, '1');
				storage.removeItem(testKey);
				return true;
			} catch (error) {
				return false;
			}
		}
});