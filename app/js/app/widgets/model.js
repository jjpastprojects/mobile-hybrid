

function Model(id, image) {
	
	this.image = image;
	this.imageObject = null;
	var width = null;
	var height = null;
	var interval = null;
	this.id = id;
	var jqueryId = "#" + id;
	
	this.angle = null;
	this.callback = null;
	
	this.duration = null;
	
	
	
			
	var imageObject = new Image();
	imageObject.src = this.image;
	imageObject.onload = function() {
		width = imageObject.width;
		height = imageObject.height;
		
		//$("#" + id).css("height", width+"px");
		//$("#" + id).css("height", height+"px");
		
	}
	
	this.rotate = function(angle, duration, callback) {
		this.angle = angle;
		this.duration = duration;		
		this.callback = callback;
		
		$(jqueryId).rotate({ animateTo:angle,"duration" : duration,"callback":callback, easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
        	  return c*(t/d)+b;
	      	}
	  });
		
	}
	this.stopRotate = function() {
		$(jqueryId).stopRotate();
	}
	
	
	
	
	
	
		
}