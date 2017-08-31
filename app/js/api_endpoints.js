// JavaScript Document

 function api_endpoint_getCookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }



var LANGUAGE = api_endpoint_getCookie('user_lang');

var CHECK_LOGIN_URL = LANGUAGE + "/session/check_login";

var LOGIN_URL = LANGUAGE + "/session/";
var LOGOUT_URL = LANGUAGE + "/auth/logout";

var REGISTER_URL = LANGUAGE + "/user/register/";

var GET_ENROLLED_COURSES_URL = LANGUAGE + "/enrollment/index/";

var GET_COURSE_SCHEMA = LANGUAGE + "/course/schema2/";

var GET_BEST_GRADES = LANGUAGE + "/student/three_best_grades/";

var AUTOGUIDE = LANGUAGE + "/course/autoguide/";

var QUIZ_ATTEMPT = LANGUAGE + "/classroom/attempt/";

var GET_LANGUAGES_URL = LANGUAGE + "/language/get_languages/";

var GET_LOCALITIES_URL = LANGUAGE + "/language/get_localities/";

var GET_ATTEMPTS_URL = LANGUAGE + "/student/get_all_attempts";

var UPLOAD_AVATAR_URL = LANGUAGE + "/user/set_avatar";

var UPDATE_USER_URL = LANGUAGE + "/user/update_user";

var GET_UPDATED_USER_URL = LANGUAGE + "/user/get_updated_user";

var CHANGE_PASSWORD_URL = LANGUAGE + "/auth/change_password2";

var HEARTBEAT_URL = LANGUAGE + "/heartbeat";

var GET_DEPENDENTS_URL = LANGUAGE + "/user/get_user_dependents";

var FORGOT_PASSWORD_URL = LANGUAGE + "/auth/forgot_password";

var LOG_ERRORS_URL = LANGUAGE + "/logger/log_error/";

