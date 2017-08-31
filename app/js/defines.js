// JavaScript Document



var DEFAULT_LANGUAGE_CODE = "en";


var userAgent = navigator.userAgent.toLowerCase();

var isMobile = (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipod') != -1 || userAgent.indexOf('ipad') != -1 || userAgent.indexOf('android') != -1) ? true : false;
var IS_IOS = false;


var CLICK_EVENT = isMobile ? 'touchstart' : 'click';
var CLICK_EVENT2 = isMobile ? 'tap' : 'click';
var MOUSE_DOWN = isMobile ? 'touchstart' : 'mousedown';
var MOUSE_UP = isMobile ? 'touchend' : 'mouseup';
var MOUSE_MOVE = isMobile ? 'touchmove' : 'mousemove';
var MOUSE_OVER = isMobile ? 'touchstart' : 'mouseover';
var MOUSE_OUT = isMobile ? 'touchend' : 'mouseout';


var HOVER_IMAGE_SELECTOR = ".hover_image";

var QUESTION_TYPE_MULTIPLE_CHOICE = 'mc';

var QUESTION_TYPE_FILL_IN_THE_BLANK = 'fib';

var QUESTION_TYPE_DRAG_AND_DROP = 'dd';

var QUESTION_TYPE_MULTIPLE_CHOICE_QUESTION = 'mcq';

var VIDEO_CONTAINER = "video_container";

//correct and incorrect colours
var CORRECT_ANSWER_BORDER = "#30CD33";
var INCORRECT_ANSWER_BORDER = "red";

var LOADING_IMAGE = "images/common/loading.gif";


var CORRECT_MARK_IMAGE = "images/classroom/correct_mark.png";
var INCORRECT_MARK_IMAGE = "images/classroom/incorrect_mark.png";

var DEFAULT_AVATAR = "images/common/gbl_default_user_image.png";

var MS_PER_SEC = 1000;
var REWIND_TIME = 200;
var DELAY_BETWEEN_QUESTIONS = 1000;
var TIMER_RESET_DELAY = 5000;



