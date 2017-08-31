app.registerUtility("Math", {
	getRandomNumber : function(number) {
		return Math.floor((Math.random() * number));
	}
});