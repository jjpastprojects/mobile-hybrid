// JavaScript Document

var HOST = window.location.hostname
//var HOST = "rajan.gravitybrain.com"
var HTTP = "";
if(HOST == "www.gravitybrain.com" || HOST == "www.bzabc.tv") {
     HTTP = "https";
} else {
    HTTP = "https";   
}

var BZABC_URL = HTTP + "://www.bzabc.tv/";

var SERVER_URL = HTTP + "://" + HOST + "/";

var SERVER_URL_APP = HTTP + "://" + HOST + "/app/";


var TEMPLATES_DIRECTORY = SERVER_URL_APP + "templates";

var IS_MOBILE = false;

var IS_DOWNLOAD = false;

var IS_DESKTOP = false;
var IS_DESKTOP_WINDOWS = false;
