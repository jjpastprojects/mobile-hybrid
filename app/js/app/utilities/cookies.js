app.registerUtility("Cookies", {
	get : function(cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    },
    save : function(cookieName, value, expireDays) {                
        var cookieString = cookieName + "=" + value + "; path=/;";
        if(!expireDays) {
            expireDays = 365 * 20;   
        }        
        var d = new Date();
        d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();    
        cookieString = cookieString + expires;        
        document.cookie = cookieString;
    }
});