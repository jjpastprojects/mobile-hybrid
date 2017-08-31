// JavaScript Document

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function VideoPlayer(options) {
    
    this.container  = options.container;
    this.playerControlsContainer = options.playControlsContainer;
    this.videos = options.videos;
    this.onEndCallback = options.onEndCallback;
    var _this = this;
    this.playButton = $("#play_button_container");
    this.pauseButton = $("#pause_button_container");
    this.progressBarInner = $("#progress_bar_inner");
    this.progressSlider = $("#progress_bar_inner_slider");
    
    this.volumeBar = $("#volume_bar");
    this.volumeBarInner = $("#volume_bar_click_area");
    this.volumeSlider = $("#volume_bar_inner");
    
    
    this.onPlay = null;
    if(options.onPlay) {
        this.onPlay = options.onPlay;    
    }
    this.onPause = null;
    if(options.onPause) {
        this.onPause = options.onPause;    
    }
    var isSliderActive = false;
    var progressSliderBarWidth = $("#progress_bar").width();
    var volumeSliderBarWidth = this.volumeBarInner.width();    
    
    
    
    
    var id = "video_" + Math.floor(Math.random()*(10000));
    
    var html = '<video width="960" height="540"  id="' + id + '" oncontextmenu="return false;" >';
    
    for(x in this.videos) {        
        var fileLocation = app.utilities.Files.getLocalFile(this.videos[x]['url']);
        
        html  += '<source src="' + fileLocation + '" >';
    }
    
    html += 'Your browser does not support the video tag.</video> ';
                
    document.getElementById(this.container).innerHTML = html;
    var video = document.getElementById(id);
    video.removeAttribute("controls");
    video.addEventListener('loadedmetadata', function() {
            
            _this.volumeSlider.css("left", (_this.getVolumeSliderBarWidth() * video.volume) + "px" );            
            $("#total_time").html(_this.getTimeDisplay(video.duration));
        });
    
    if(_this.onEndCallback) {
        video.addEventListener('ended', function(e) {
                _this.onEndCallback();                                     
            });
    }
    

    video.addEventListener('play', function(e) {
        _this.playButton.hide();
        _this.pauseButton.show();
        _this.volumeBar.hide();
        if(_this.onPlay) {
            _this.onPlay();                                 
        }
    });    
    
    
    
    video.addEventListener('pause', function(e) {
        _this.pauseButton.hide();
        _this.playButton.show();    
        _this.volumeBar.hide();
        if(_this.onPause) {
            _this.onPause();                                 
        }
    });    
    
    
    video.addEventListener('timeupdate', function(e) {
            $("#current_time").html(_this.getTimeDisplay(video.currentTime));
            $("#total_time").html(_this.getTimeDisplay(video.duration));
            if(!isSliderActive) {
                _this.updateSlider();
            }
        });
    this.progressSlider.draggable({
        "start" : function() {_this.startProgressSlide()},
        "stop" : function(){_this.endProgressSlide()},
        "drag" : function(e, ui) {_this.dragProgressSlider();},
        "containment" : "#progress_bar",
        "scrollSpeed" : 10,
        "axis" : "x"
    });
    
    this.volumeSlider.draggable({
        
        "drag" : function(e, ui) {_this.dragVolumeSlider();},
        "containment" : "#volume_bar_click_area",
        "scrollSpeed" : 10,
        "axis" : "x"
    });
    
    
    
    $("#play_button_container").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {            
            _this.play();                                                         
        });
    $("#pause_button_container").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {            
            _this.pause();                                                         
        });
    
    $("#fullscreen_button_container").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {            
            _this.fullscreen();                                                        
        });
    $("#volume_button_container").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
            _this.showVolume();                                                           
        });
    
    this.play = function() {
        video.play();
        
    }
    this.stop = function() {        
        this.pause();    
    }
    this.pause = function() {        
        video.pause();
        
        
    }
    this.restart = function() {
        video.load();
        this.play();
    }
    this.fullscreen = function() {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
          video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }    
    }
    
    this.updateSlider = function() {
        var pixels = progressSliderBarWidth * (video.currentTime / video.duration);
        this.progressBarInner.css("width", pixels + "px");
        this.progressSlider.css("left", pixels + "px");
    }
    this.startProgressSlide = function() {
        isSliderActive = true;
    }
    this.endProgressSlide = function() {
        isSliderActive = false;
    }
    this.dragProgressSlider = function(e, ui) {
        var pixels = _this.progressSlider.css("left");
        
        
        this.progressBarInner.css("width", pixels);
        var left = pixels.replace("px", "");
        var percentage = left / progressSliderBarWidth;
        var newTime = percentage * video.duration;
        video.currentTime = newTime;
    }
    
    this.showVolume = function() {
        this.volumeBar.toggle("slide", { direction: "left" }, 1000);
    }
    this.dragVolumeSlider = function() {
        var pixels = _this.volumeSlider.css("left");
        
        var left = pixels.replace("px", "");
        var percentage = left / this.getVolumeSliderBarWidth();
        
        video.volume = percentage;
    }
    this.getVolumeSliderBarWidth = function() {
        return volumeSliderBarWidth - _this.volumeSlider.width();
    }
    
    this.getTimeDisplay = function(seconds) {
        var hours = parseInt(seconds / 60);
        var seconds = parseInt((seconds % 60));
        return hours + ":" + String(seconds).lpad("0",2);
    }
    
}