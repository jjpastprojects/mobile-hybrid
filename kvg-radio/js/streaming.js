
var _volume = '0.0';
var _loading = false;

var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
var target = document.getElementById('loading-dialog');
var spinner = new Spinner(opts);


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('online', this.onReconnect, false);
        $(document).on("click", "#play", this.performPlay);
        $(document).on("click", "#mute", this.performMute);
        $('#seek').change(this.performVolumeChange);
    },
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        FastClick.attach(document.body);
    },
    onReconnect: function() {
        app.receivedEvent('online');
    },
    performPlay: function() {
        app.receivedEvent('play');
    },
    performMute: function() {
        app.receivedEvent('mute');
    },
    performVolumeChange: function() {
        var val = parseFloat($("#seek").val());
        val = val / 100;
        audioPlayer.setVolume(val);
        if(val <= 0.0) {
            UI.mute(true);
        } else {
            UI.mute(false);
        }
    },
    receivedEvent: function(id) {
        if (id == 'deviceready') {
            if(isConnected()) {

            } else {
                $(".error").css("display","block");
            }
        } else if(id == 'play') {
            if(_loading) {
                return;
            }
            if(audioPlayer.isPlaying) {
				alert("stop");
                audioPlayer.pause();
            } else {
				alert("start");
                audioPlayer.play("http://htr.serverroom.us:8200/;stream.mp3");
            }
        } else if (id == 'mute') {
            if(_loading) {
                return;
            }
            audioPlayer.mute();
        } else if (id == 'online') {
            if($(".error").css("display") == "block") {
                $(".error").css("display", "none");
            }
        }
    }
};

var audioPlayer = {
    my_media : null,
    volume : 1.0,
    isPlaying : false,
    play: function(src) {
        if (this.my_media == null) {
			alert("mymedia = null + " + src);
            this.my_media = new Media(src, this.playSuccess, this.playError, this.playStatus);
        }
        this.my_media.play();
    }, 
    pause: function() {
        if (this.my_media) {
            this.my_media.pause();
        }
    },
    stop: function() {
        if (this.my_media) {
            this.my_media.stop();
        }
        //clearInterval(mediaTimer);
        //mediaTimer = null;
    },
    getVolume: function() {
        return this.volume;
    },
    setVolume: function(v) {
        this.my_media.setVolume(v.toString());
        this.volume = v;
    },
    mute: function() {
        if(this.volume > 0.0) {
            _volume = this.volume;
            this.setVolume(0.0);
            UI.mute(true);
        } else {
            this.setVolume(_volume);
            UI.mute(false);
        }
    },
    playSuccess: function() {
        
    },
    playError: function(error){
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    },
    playStatus: function(status) {
        if(status == Media.MEDIA_NONE) {

        } else if(status == Media.MEDIA_STARTING) {
            UI.showLoading();
        } else if (status ==Media.MEDIA_RUNNING) {
            UI.togglePlay();
            UI.hideLoading();
            audioPlayer.isPlaying = true;
        } else if (status ==Media.MEDIA_PAUSED) {
            UI.togglePause();
            audioPlayer.isPlaying = false;
        } else if (status == Media.MEDIA_STOPPED) {
            UI.togglePause();
            audioPlayer.isPlaying = false;
        }
    },
    setAudioPosition: function(position) {
        //document.getElementById('audio_position').innerHTML = position;
    }
};


var UI = {
    togglePlay: function() {
        $("#play i").removeClass("fa-play");
        $("#play i").addClass("fa-pause");
        $(".on-air").fadeIn();
    },
    togglePause: function(){
        $("#play i").removeClass("fa-pause");
        $("#play i").addClass("fa-play");
        $(".on-air").fadeOut();
    },
    showLoading: function() {
        $("div#loading-dialog").css("display","block");
        _loading = true;
        target.appendChild(spinner.el);
    },
    hideLoading: function() {
        $("div#loading-dialog").css("display","none");
        _loading = false;
        spinner.stop();
    },
    mute: function(val) {
        if(val) {
            $("#mute i").removeClass("fa-volume-up");
            // $("#mute i").removeClass("fa-volume-down");
            $(".on-air").fadeOut();
            $(".mute").fadeIn();

            $("#mute i").addClass("fa-volume-off");
        } else {
            $("#mute i").removeClass("fa-volume-off");
            $("#mute i").addClass("fa-volume-up");

            $(".mute").fadeOut();
            $(".on-air").fadeIn();
        }
    }
}
