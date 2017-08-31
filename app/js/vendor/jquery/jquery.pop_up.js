
(function( $ )
{   

function pageWidth() {
		return window.innerWidth != null? window.innerWidth : document.documentElement && document.documentElement.clientWidth ?       document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;} 
		
	function pageHeight() {return  window.innerHeight != null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ?  document.documentElement.clientHeight : document.body != null? document.body.clientHeight : null;
		} 

    var methods = {
    
            start : function( options )
            {
				//console.log(options);
				//leave out the "var" keyword for variables to be accessible throughout plugin methods
				//$ = $(this);
				//specify the default settings
                settings = {
						url: null,
						content: null,
						padding: {x:75, y: 75},
						closeButtonHeight: 30,
						closeButton: '/public/images/common/close-icon.png',
						loadingImage: '',
						startSize: {x: 300, y: 225 },
						endSize: null,
						overlayOpacity:	0.4,
						overlayFade: 750,
						overlayColor: '#000',
						closeKey: null,
						resizeTime: 100,
						loaderFadeout: 100,
						animationCallback : null,
						closeable : true,
                }
                //override defaults if options are provided
                if( options )
                {
                    $.extend( settings, options);
                }
				
				//Start the initial setup
				$('embed, object, select').css({ 'visibility' : 'hidden' }); //hide elements that don't layer properly in IE

				$.fn.popup('close');
				$.fn.popup('show');
				
				
				if(settings.url != null)
				{
					$.ajax({ url: settings.url, /*settings: getVariables, */	  settingsType: "html", cache: false, context: this, success: function(response, status, httpRequest){ $.fn.popup('contentLoaded', response);} });
					//$.ajax(settings.content, { context: $('popup-container'), settingsType: 'html'});
				}
				
				$(window).bind('resize.popup', function(){$.fn.popup('update')});
				$(window).bind('scroll.popup', function(){$.fn.popup('update')});
				if(settings.closeable) {
					$('#popup-close-button').bind('click.popup', methods.close);
				}
				
                return $(this);
            },
            
			show: function()
			{			
				
				//Add the overlay to the DOM if the opacity is greater than 0.
				if(settings.overlayOpacity > 0)
				{ 
					jQuery('body').append('<div id="popup-overlay"></div>');

					$('#popup-overlay').css({  backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity, width:pageWidth(), height:pageHeight() }).fadeIn(settings.overlayFade);
				}
				
				//Add the popup
				
				var bodyHTML = '<div id="popup"><div id="popup-image-container">';
				if(settings.closeable) {
					bodyHTML += '<img id="popup-close-button" src="'+settings.closeButton+'" alt="X" /></div>';
				}
				
				bodyHTML += '<div id="popup-container"><div id="popup-message-container"></div><div id="popup-content"></div></div></div>';
				
				
				jQuery('body').append(bodyHTML);	
				jQuery.fn.popup('showContent');
				
				jQuery('#popup').css({  left: (pageWidth() - parseInt(settings.startSize.x,10))/2, top: (pageHeight() - parseInt(settings.startSize.y,10))/2, width: settings.startSize.x, height: settings.startSize.y});
				
				settings.rectangle = {width: pageWidth() - settings.padding.x, height: pageHeight() - settings.padding.y};
				
				if(settings.endSize != null)
				{
					settings.rectangle.width = Math.min(settings.rectangle.width, settings.endSize.width);
					settings.rectangle.height =  Math.min(settings.rectangle.height, settings.endSize.height);
				}
				//console.log(settings.rectangle.width);
				//console.log(settings.endSize.width);
				settings.rectangle.x = (pageWidth() - settings.rectangle.width)/2;
				settings.rectangle.y = (pageHeight() - settings.rectangle.height)/2;
				
				jQuery('#popup-loading').css({  top: pageHeight()/2, left: pageWidth()/2 }).fadeIn(settings.resizeTime);
                
                
				
				jQuery('#popup').animate({left: settings.rectangle.x, top: settings.rectangle.y, width: settings.rectangle.width, height: settings.rectangle.height }, settings.resizeTime, function(){ jQuery.fn.popup('animationEnded'); });
				jQuery('#popup-container').animate({ top: settings.rectangle.y + settings.closeButtonHeight, height: settings.rectangle.height - settings.closeButtonHeight }, settings.resizeTime, function(){});
				return jQuery(this);
			},
			
			animationEnded: function()
			{
				settings.ready = true;
				if(settings.content != null)
				{
					jQuery('#popup-loading').fadeOut(settings.loaderFadeout, function(){  });
				}
				if(settings.animationCallback){
					settings.animationCallback();	
				}
				return jQuery(this);
			},
			
			contentLoaded: function(response)
			{		
				settings.content = response;
				if(settings.ready)
				{
					jQuery('#popup-loading').fadeOut(settings.loaderFadeout, function(){ jQuery.fn.popup('showContent') });
				}
				return jQuery(this);
			},
			
			showContent: function()
			{			
				jQuery('#popup-loading').remove();
				jQuery('#popup-content').html(settings.content);
				settings.content = null;
				return jQuery(this);
			},
			
			close: function()
			{
				jQuery('embed, object, select').css({ 'visibility' : 'visible' });
				jQuery("#popup").remove();
				jQuery("#popup-overlay").remove();
				jQuery.fn.popup('destroy');
				 //restore elements that don't layer properly in IE
				return jQuery(this);
			},
			update: function()
			{
				settings.rectangle = {width: pageWidth() - settings.padding.x, height: pageHeight() - settings.padding.y};
				if(settings.endSize != null)
				{
					settings.rectangle.width = Math.min(settings.rectangle.width, settings.endSize.width);
					settings.rectangle.height = Math.min(settings.rectangle.height, settings.endSize.height);
				}
				settings.rectangle.x = (pageWidth() - settings.rectangle.width)/2;
				settings.rectangle.y = (pageHeight() - settings.rectangle.height)/2;
				
				jQuery('#popup').css({left: settings.rectangle.x, top: settings.rectangle.y, width: settings.rectangle.width, height: settings.rectangle.height });
				jQuery('#popup-container').height( jQuery('#popup').height() - settings.closeButtonHeight);
				if(jQuery('#popup-loading').length)
					jQuery('#popup-loading').css({  top: pageHeight()/2, left: pageWidth()/2 });
				return jQuery(this);
			},
			
            destroy: function( )
            {
               	jQuery(window).unbind('.popup');
				jQuery('#popup-close-button').unbind('.popup');
				return jQuery(this);
            }
    }
    
    //declare the plugin and allow method calling
     jQuery.fn.popup = function( method )
     {
            // Method calling logic
            if ( methods[method] ) {
              return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
              return methods.start.apply( this, arguments );
            } else {
              jQuery.error( 'Method ' +  method + ' does not exist on jQuery.popup' );
            }
     };
    
})( jQuery );