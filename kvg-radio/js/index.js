var SERVER_URL = 'http://codewaretechnologies.in/';

var _volume = 0.0;
var _loading = false;


var opts = {
  lines: 9, // The number of lines to draw
  length: 6, // The length of each line
  width: 2, // The line thickness
  radius: 4, // The radius of the inner circle
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

var spinner;

var img_home = 'images/btn4.png';
var img_home_active = 'images/btn4-1.png';

var img_streaming = 'images/btn3.png';
var img_streaming_active = 'images/btn3-1.png';

var img_news = 'images/btn5.png';
var img_news_active = 'images/btn5-1.png';

var img_community = 'images/btn1.png';
var img_community_active = 'images/btn1-1.png';

var img_archives = 'images/btn2.png';
var img_archives_active = 'images/btn2-1.png';

var pagesNews = 1;
var lastid = 0;
var firstid = 99999999;
var lasteventid = 0;
var firsteventid = 99999999;
var adsLaunched = false;
var advertising_list = new Array();
var featured_list = new Array();
var playing = false;
var app = {
    initialize: function() {
        this.bindEvents();
        $.support.cors = true;
		loadAdvertising();
		$("#featured-ads-wrapper").css("display","none");
		$("#seek").width($( window ).width() - 143);
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //$(document).ready(this.onDeviceReady);
        document.addEventListener('online', this.onReconnect, false);
        document.addEventListener('backbutton', this.onBack, false);
		
        $("#b-home").click(this.onClickHome);
        $("#b-streaming").click(this.onClickStreaming);
        $("#b-news").click(this.onClickNews);
        $("#b-community").click(this.onClickCommunity);
        $("#b-archives").click(this.onClickArchives);

        $("#btn-streaming").click(this.onClickStreaming);
        $("#btn-news").click(this.onClickNews);
        $("#btn-community").click(this.onClickCommunity);
        $("#btn-archives").click(this.onClickArchives);

        $(".back").click(this.onSoftBack);

        $("#play").click(this.performPlay);
        $("#mute").click(this.performMute);
        $('#seek').change(this.performVolumeChange);

        $('.news-list-bottom').bind('inview', this.loadMoreNews);
        //$('#news-c').click(this.newsDescription);
        $(document).on('click', "#news-c", this.newsDescription);
		$(document).on('click', "#advertising-c", this.advertisingDescription);
		$(document).on('click', "#featured-link", this.featuredDescription);
		$(document).on('click', "#featured-ads-content", this.featuredDescription);
        //$('.event-list-bottom').bind('inview', this.loadMoreEvents);
        //$('#event-list #event-c').click(this.eventDescription);
        $(document).on('click', "#event-c", this.eventDescription);
		$(document).on('click', 'a', this.onClickLink);
    },
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        FastClick.attach(document.body);
		loadAdvertising();
		$("#featured-ads-wrapper").css("display","none");
    },
    onClickHome: function() {
        app.receivedEvent('b-home');
		loadAdvertising();
    },
    onClickStreaming: function(){
        app.receivedEvent('b-streaming');
    },
    onClickNews: function() {
        app.receivedEvent('b-news');
    },
    onClickCommunity: function() {
        app.receivedEvent('b-community');
    },
    onClickArchives: function() {
        app.receivedEvent('b-archives');
    },
    onSoftBack: function() {
        //window.history.back();
        S.goToPage(localStorage.lastPage);
    },
    onReconnect: function() {
        app.receivedEvent('online');
		loadAdvertising();
    },
    onBack: function() {
        app.receivedEvent('backbutton');
    },
    performPlay: function() {
        app.receivedEvent('play');
    },
    performMute: function() {
        app.receivedEvent('mute');
    },
    performVolumeChange: function() {
        if(_loading) {
            return;
        }
        var val = parseFloat($("#seek").val());
        val = val / 100;
        audioPlayer.setVolume(val);
        if(val <= 0.0) {
            UI.mute(true);
        } else {
            UI.mute(false);
        }
    },
    loadMoreNews: function(event, isInView, visiblePartX, visiblePartY) {
        if (isInView && !isNewsLoading) {
            loadNews(lastid);
        } else {
            // element has gone out of viewport
        }
    },
    newsDescription: function() {
        loadNewsDesc($(this).attr("data-id"));
        localStorage.news_head = $(this).children("h4").text();
		localStorage.news_date = $(this).children("p").text();
        localStorage.lastPage = "news";
    },
	advertisingDescription: function() {
		loadAdvertisingUrl($(this).attr("data-id"));
        localStorage.lastPage = "news";
		window.open($(this).attr("data-id"), '_blank');
	},
	featuredDescription: function() {
		loadAdvertisingUrl($("#featured-link").attr("data-id"));
        localStorage.lastPage = "streaming";
		window.open($("#featured-link").attr("data-id"), '_blank');
	},
    loadMoreEvents: function(event, isInView, visiblePartX, visiblePartY) {
        if (isInView && !isEventLoadinf) {
            loadEvents();
        } 
    },
    eventDescription: function() {
        loadEventDesc($(this).attr("data-id"));
        localStorage.event_head = $(this).children("h4").text();
		localStorage.event_date = $(this).children("p").text();
        localStorage.lastPage = "community";
    },
	onClickLink: function() {
		var link = $(this).attr("href");
		if (link == null || link == '') {
			return;
		} else {
			window.open(link, '_blank');
			return false;
		}
			
	},
    receivedEvent: function(id) {
        if (id == 'deviceready') {
            if(isConnected()) {
                S.init();
            } else {
                $(".error").css("display","block");
            }
        } else if (id == 'online') {
            if($(".error").css("display") == "block") {
                $(".error").css("display", "none");
            }
        } else if (id == 'backbutton') {
            navigator.notification.confirm(
                'Are you sure, want to quit',  // message
                this.confirmExit,         // callback
                'Exit!',
                ['Cancel','Exit']
            );
        } else if(id=='b-streaming') {
            S.goToPage("streaming");
			if (adsTitle != '') {
				$("#featured-ads-wrapper").animate({
					bottom: '75px'
				});
				adsLaunched = true;
			}
			timer.play();
        } else if(id == 'play') {
            if(audioPlayer.isPlaying) {
                audioPlayer.pause();
            } else {
				audioPlayer.play("http://htr.serverroom.us:8200/;stream.mp3");
            }
        } else if (id == 'mute') {
            audioPlayer.mute();
        } else if(id == "b-home") {
            S.goToPage("home");
        } else if(id == "b-news") {
            S.goToPage("news");
	    loadFirstNews(firstid);
        } else if(id == "b-community") {
            S.goToPage("community");
            loadEvents();
        } else if(id == "b-archives") {
            S.goToPage("archives");
        } else if(id == "news-desc") {
            S.goToPage("news-desc");
        } else if(id == "event-desc") {
            S.goToPage("event-desc");
        }
    },
    confirmExit: function(index) {
        if(index == 2) {
            S.quit();
        }
    }
};

var S = {
    init: function() {
        UI.showPage("home");
        NAV.push("home");
    },
    goToPage: function(id) {
        UI.showPage(id);
        NAV.push(id);
    },
    goBack: function() {
        NAV.pop();
        var last = NAV.backStack[NAV.getCount() - 1];
        goToPage(last);
    },
    quit: function() {
        navigator.app.exitApp();
    }
};

var NAV = {
    backStack: [],
    push: function(id) {
        this.backStack.push(id);
    },
    pop: function() {
        this.backStack.pop();
    },
    getCount: function() {
        return this.backStack.length;
    }
};

var UI = {
    showPage: function(id) {
        NAV.push(id);
        if(id == "home") {
            this.PM.home();
        } else if(id== "streaming"){
            this.PM.streaming();
        } else if(id== "news"){
            this.PM.news();
        } else if(id== "archives"){
            this.PM.archives();
        } else if(id== "community"){
            this.PM.community();
        } else if(id == "news-desc") {
            this.PM.newsDesc();
        } else if(id == "event-desc") {
            this.PM.eventDesc();
        } else if (id == "ad-desc") {
			this.PM.adDesc();
		}
    },
    PM: {
        home:function() {
            $("#home").css("display","block");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","none");

            $("#b-home").addClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home_active);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);
            $(".back").css("visibility","hidden");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
        streaming: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","block");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").addClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming_active);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);

            $(".back").css("visibility","hidden");
			$("#featured-ads-wrapper").css("display","block");
        },
        news: function() {
            //var target = $(".list-bottom");
            //spinner = new Spinner(opts).spin(target);

            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","block");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").addClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news_active);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);

            $(".back").css("visibility","hidden");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
        newsDesc: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#news-desc").css("display","block");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);

            $(".back").css("visibility","visible");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
		adDesc: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#ad-desc").css("display","block");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);
            $(".back").css("visibility","visible");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
        community: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","block");
            $("#archives").css("display","none");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").addClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community_active);
            $("#b-archives img").attr("src",img_archives);

            $(".back").css("visibility","hidden");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
        eventDesc: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","none");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","block");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").removeClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives);

            $(".back").css("visibility","visible");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        },
        archives: function() {
            $("#home").css("display","none");
            $("#streaming").css("display","none");
            $("#news").css("display","none");
            $("#community").css("display","none");
            $("#archives").css("display","block");
            $("#news-desc").css("display","none");
            $("#event-desc").css("display","none");

            $("#b-home").removeClass("custom_active");
            $("#b-streaming").removeClass("custom_active");
            $("#b-news").removeClass("custom_active");
            $("#b-community").removeClass("custom_active");
            $("#b-archives").addClass("custom_active");

            $("#b-home img").attr("src",img_home);
            $("#b-streaming img").attr("src",img_streaming);
            $("#b-news img").attr("src",img_news);
            $("#b-community img").attr("src",img_community);
            $("#b-archives img").attr("src",img_archives_active);

            $(".back").css("visibility","hidden");
			$("#featured-ads-wrapper").css("display","none");
			$("#featured-ads-wrapper").css("bottom","0px");
			timer.stop();
        }
    },
    togglePlay: function() {
        $("#playi").removeClass("fa-play");
        $("#playi").addClass("fa-pause");
        $(".on-air").fadeIn();
    },
    togglePause: function(){
        $("#playi").removeClass("fa-pause");
        $("#playi").addClass("fa-play");
        $(".on-air").fadeOut();
    },
    showLoading: function() {
        $("div#loading-dialog").css("display","block");
        _loading = true;
    },
    hideLoading: function() {
        $("div#loading-dialog").css("display","none");
        _loading = false;
    },
    mute: function(val) {
        if(val) {
            $("#mutei").removeClass("fa-volume-up");
            // $("#mute i").removeClass("fa-volume-down");
            $(".on-air").fadeOut();
            $(".mute").fadeIn();

            $("#mutei").addClass("fa-volume-off");
        } else {
            $("#mutei").removeClass("fa-volume-off");
            $("#mutei").addClass("fa-volume-up");

            $(".mute").fadeOut();
            $(".on-air").fadeIn();
        }
    }
};


var totalNews = 0;
var idxNews = 0;
var idxEvent = 0;
var idxAds = 0;
var cntAds = 1;
var adsTitle = '';
var adsDescription = '';
var adsLink = '';
var isNewsLoading = false;
var effect_options = {direction:"down"};
var timer = $.timer(function() {
  if (featured_list == null || featured_list.length == 0)
	return;
  
  if (adsTitle == '') {
		adsTitle = featured_list[idxAds].name;
		adsDescription = featured_list[idxAds].description;
		adsLink = featured_list[idxAds].clickurl;
  }
  if (!adsLaunched) {
     $( "#featured-link").html(adsTitle);
	 $( "#featured-link").attr("data-id",adsLink);
     $("#featured-ads-wrapper").animate({
		bottom: '75px'
	 });
	 adsLaunched = true;
	 return;
  }
  $( "#featured-ads-content" ).effect( "drop", effect_options, 500, callback );
});
function callback() {
      setTimeout(function() {
		if ($( "#featured-ads-content").hasClass("title")) {
		  $( "#featured-ads-content").removeClass("title").addClass("content");
		  $( "#featured-link").html(adsDescription);
		} else {
		   $( "#featured-ads-content").removeClass("content").addClass("title");
		   $( "#featured-link").html(adsTitle);
		}
		if (cntAds == 3) {
			effect_options['direction'] = 'left';
		} else {
			effect_options['direction'] = 'down';
		}
		if (cntAds == 4) {
			if (idxAds < featured_list.length-1)
				idxAds++;
			else
				idxAds = 0;
			adsTitle = featured_list[idxAds].name;
			adsDescription = featured_list[idxAds].description;
			adsLink = featured_list[idxAds].clickurl;
		   $( "#featured-ads-content").removeClass("content").addClass("title");
		   $( "#featured-link").html(adsTitle);
		   $( "#featured-link").attr("data-id",adsLink);
		   cntAds = 1;
			
		} else {
			cntAds ++;
			
		}
		
		$( "#featured-ads-content" ).removeAttr( "style" ).hide().fadeIn();
      }, 1000 );
    };
timer.set({ time : 5000, autostart : false });

function loadAdvertising() {
	console.log("advertising_service.php");
	if (advertising_list != null && advertising_list.length > 0)
		return;
    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
		url : "http://kvgcradio.com/apis/" + "ads_webservice.php",
        beforeSend : function() {
            console.log(this.url);
            _loading = true;
        },
        success : function(msg) {
            JSON.stringify(msg);
			for(var i = 0; i < msg.data.length; i++) {
				var row = msg.data[i];
				if (row.featured == '1')
					featured_list.push(row);
				advertising_list.push(row);
			}
        },
        error : function(jqXHR, text_status, strError) {
        },
        complete : function() {
           console.log("advertising list completely loaded.");
           _loading = false;
        }
    });
}
function loadNews(n) {
	if (advertising_list == null || advertising_list.length == 0) 
		loadAdvertising();
    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
		url : "http://kvgcradio.com/apis/" + "news_webservice.php?lastid=" + lastid,
        beforeSend : function() {
            console.log(this.url);
            isNewsLoading = true;
            _loading = true;
        },
        success : function(msg) {
            JSON.stringify(msg);
            
			
            var array = msg.data;
			if (lastid == 0) {
				if (array.length > 0) {
					firstid = array[0].id;
				}
			}
			if (array.length > 0) {
				lastid = array[array.length-1].id;
				totalNews = totalNews + array.length;
			}
			for(var i = 0; i < array.length; i++) {
				idxNews = idxNews + 1;
				var item;
				if (idxNews % 6 == 0 && idxNews > 0 && typeof(advertising_list) !== "undefined" && advertising_list !== null && advertising_list.length>0) {
					var idx = (idxNews/6) % advertising_list.length;
					item = '<a id="advertising-c" class="list-group-item advertising text-left" data-id="'+advertising_list[idx].clickurl+'">	<h4 class="list-group-item-heading">'+ advertising_list[idx].name + '</h4><p class="list-group-item-text black-title">WebSite:'+advertising_list[idx].clickurl+'</p><p class="list-group-item-text">'+//
						advertising_list[idx].description +'</p></a>';				
				} else {
					item = '<a id="news-c" class="list-group-item text-left" data-id="'+array[i].id+'"><h4 class="list-group-item-heading">'+//
					array[i].title + '</h4><p class="list-group-item-text">'+//
					array[i].date +'</p></a>';
				}
				
				$("#news-list").append(item);
			}
        },
        error : function(jqXHR, text_status, strError) {
            // var item = '<a id="news-c" class="list-group-item text-left" data-id="'+'error'+'"><h4 class="list-group-item-heading">'+//
            //     strError + '</h4><p class="list-group-item-text">'+//
            //     text_status +'</p></a>';
            // $("#news-list").append(item);
        },
        complete : function() {
           console.log("news completely loaded.");
           isNewsLoading = false;
           _loading = false;
        }
    });
}
function loadFirstNews(n) {
    if (firstid >= 99999999)
    	return;
    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
		url : "http://kvgcradio.com/apis/" + "news_webservice_more.php?lastid=" + firstid,
        beforeSend : function() {
            console.log(this.url);
            isNewsLoading = true;
            _loading = true;
        },
        success : function(msg) {
            JSON.stringify(msg);
            var array = msg.data;
	    var items = '';
            for(var i = 0; i < array.length; i++) {
                var item = '<a id="news-c" class="list-group-item text-left" data-id="'+array[i].id+'"><h4 class="list-group-item-heading">'+//
                array[i].title + '</h4><p class="list-group-item-text">'+//
                array[i].date +'</p></a>';
		items = items + item;
            }
	    $("#news-list").html(items + $("#news-list").html());
        },
        error : function(jqXHR, text_status, strError) {
        },
        complete : function() {
           console.log("above news completely loaded.");
           isNewsLoading = false;
           _loading = false;
        }
    });
}
function loadNewsDesc(id) {
    S.goToPage("news-desc");

    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
        //url : SERVER_URL + "news_webservice_description.php?id=" + id,
	url : "http://kvgcradio.com/apis/" + "news_webservice_description.php?id=" + id,
        beforeSend : function() {
            console.log(this.url);
            _loading = true;
            //isNewsLoading = true;
            $("#div-news-desc").css("visibility","hidden");
        },
        success : function(msg) {
            JSON.stringify(msg);
            var desc = msg.description;

            desc = desc.replace(/[�]/,'');

            $("#div-news-desc #news-detail").html(desc);
            $("#div-news-desc #news-heading").html(localStorage.news_head);
	    $("#div-news-desc #news-date").html(localStorage.news_date);
        },
        error : function(jqXHR, text_status, strError) {
            // alert(strError);
            // $("#div-news-desc #news-heading").html(localStorage.news_head);
            // $("#div-news-desc #news-detail").html("Error");
        },
        complete : function() {
           console.log("news detail loaded.");
           _loading = false;
           //isNewsLoading = false;
           $("#div-news-desc").css("visibility","visible");
        }
    });
}
function loadAdvertisingUrl(url) {
    //S.goToPage("ad-desc");
	//$("#div-news-desc").css("visibility","hidden");
    //$('#ad-desc').load(url);
	//$('#ad-desc').innerHTML='<object type="text/html" data="'+url+'" ></object>';
}
var isEventLoadinf = false;
function loadEvents() {
	if (advertising_list == null || advertising_list.length == 0) 
		loadAdvertising();
	idxEvent = 0;
    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
        //url : SERVER_URL + "community_webservice.php?lastid="+lasteventid,
		url : "http://kvgcradio.com/apis/" + "community_webservice.php?lastid=" + lasteventid,
        beforeSend : function() {
            console.log(this.url);
            isEventLoadinf = true;
            _loading = true;
        },
        success : function(msg) {
            JSON.stringify(msg);
            var array = msg.data;
			if (lasteventid == 0) {
				if (array.length > 0) {
					firsteventid = array[0].id;
				}
			}
			if (array.length > 0) {
				lasteventid = array[array.length-1].id;
			}
			$("#event-list").html('');
            for(var i = 0; i < array.length; i++) {
				idxEvent = idxEvent + 1;
				var item;
				if (idxEvent % 6 == 0 && idxEvent > 0 && typeof(advertising_list) !== "undefined" && advertising_list !== null && advertising_list.length>0) {
					var idx = (idxEvent/6) % advertising_list.length;
					item = '<a id="advertising-c" class="list-group-item advertising text-left" data-id="'+advertising_list[idx].clickurl+'">	<h4 class="list-group-item-heading">'+ advertising_list[idx].name + '</h4><p class="list-group-item-text black-title">WebSite:'+advertising_list[idx].clickurl+'</p><p class="list-group-item-text">'+//
						advertising_list[idx].description +'</p></a>';				
				} else {
					item = '<a id="event-c" class="list-group-item text-left" data-id="'+array[i].id+'"><h4 class="list-group-item-heading">'+//
					array[i].title + '</h4><p class="list-group-item-text">'+//
					array[i].date +'</p></a>';
				}
					$("#event-list").append(item);
            }
        },
        error : function(jqXHR, text_status, strError) {
        },
        complete : function() {
           console.log("events completely loaded.");
           isEventLoadinf = false;
           _loading = false;
        }
    });
}

function loadEventDesc(id){
    S.goToPage("event-desc");

    $.ajax({
        type : "GET",
        dataType : "jsonp",
        crossDomain : true,
        async : false,
        //url : SERVER_URL + "community_description_webservice.php?id=" + id,
		url : "http://kvgcradio.com/apis/" + "community_description_webservice.php?id=" + id,
        beforeSend : function() {
            console.log(this.url);
            _loading = true;
            //isNewsLoading = true;
            $("#div-event-desc").css("visibility","hidden");
        },
        success : function(msg) {
            JSON.stringify(msg);
            var desc = msg.description;
			var from = msg.from;
			var to = msg.to;
			var location = msg.location;
            $("#div-event-desc #event-detail").html(desc);
            $("#div-event-desc #event-heading").html(localStorage.event_head);
			//$("#div-event-desc #event-date").html(localStorage.event_date);
			if (to != '') {
				$("#div-event-desc #event-enddate").html(to);
				$("#div-event-desc #event-enddate").show();
			} else {
				$("#div-event-desc #event-enddate").hide();
			}
			
			if (location != '') {
				$("#div-event-desc #event-location").html(to);
				$("#div-event-desc #event-location").show();
			} else {
				$("#div-event-desc #event-location").hide();
			}
			
			$("#div-event-desc #event-date").html(from);

        },
        error : function(jqXHR, text_status, strError) {
            // alert(strError);
            // $("#div-event-desc #event-heading").html(localStorage.event_head);
            // $("#div-event-desc #event-detail").html("Cal Trans announced that out of $138 million allocated for 2014, projects near Lake Tahoe and the MokelumneRiver will see action.  Nearly $9 million will go to a Highway 12 Mokelumne River Bridge project near Iselton.  The project will replace the bridge?s concrete deck, and local commuters should experience an improved ride.  The project will also extend the bridge?s service life.    Motorists should also benefit from improvements along Highway 50 that come with a price tag of nearly $14 million.  Drainage systems will be replaced along the highway near South Lake Tahoe, bringing the area in compliance with a national pollution permit.  The funding came from a combination of assorted state and federal transportation accounts and Proposition 1B bond disbursements.");
        },
        complete : function() {
           console.log("event detail loaded.");
           _loading = false;
           $("#div-event-desc").css("visibility","visible");
           //isNewsLoading = false;
        }
    });
}


var audioPlayer = {
    my_media : null,
    volume : 1.0,
    isPlaying : false,
    play: function(src) {
        if (this.my_media == null) {
            this.my_media = new Media(src, this.playSuccess, this.playError, this.playStatus);
        }
        this.my_media.play();
		
		$("#playi").removeClass("fa-play");
        $("#playi").addClass("fa-pause");
        $(".on-air").fadeIn();
		audioPlayer.isPlaying = true;
    }, 
    pause: function() {
        if (this.my_media) {
            this.my_media.pause();
			$("#playi").removeClass("fa-pause");
			$("#playi").addClass("fa-play");
			$(".on-air").fadeOut();
			audioPlayer.isPlaying = false;
        }
    },
    stop: function() {
        if (this.my_media) {
            this.my_media.stop();
			$("#playi").removeClass("fa-stop");
			$("#playi").addClass("fa-play");
			$(".on-air").fadeOut();
			audioPlayer.isPlaying = false;
        }
        //clearInterval(mediaTimer);
        //mediaTimer = null;
    },
    getVolume: function() {
        return this.volume;
    },
    setVolume: function(v) {
		/*if (v == null)
			return;*/
		if (this.my_media == null)
			return;
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
        //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    },
    playStatus: function(status) {
		/*
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
		*/
    },
    setAudioPosition: function(position) {
        document.getElementById('audio_position').innerHTML = position;
    }
};
$( window ).resize(function() {
 $("#seek").width($( window ).width() - 143);
});
$( window ).on( "orientationchange", function( event ) {
 $("#seek").width($( window ).width() - 143);
});