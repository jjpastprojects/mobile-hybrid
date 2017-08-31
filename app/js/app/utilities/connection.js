app.registerUtility("Connection", {
					
		check : function() {
			
			if(navigator && navigator.connection && typeof(Connection) !== 'undefined') {
				var networkState = navigator.connection.type;
				
				$("#connection_status").html(networkState);
				if(networkState != Connection.NONE && networkState != Connection.UNKNOWN) {
					return true;	
				}
				return false;
			} else {
				return true;	
			}
		},
	});