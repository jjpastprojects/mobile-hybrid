$( document ).on( "pageinit","#qrcode",function() {
                 FastClick.attach(document.body);
                 
                 alert('qrcccc');
                 
                 var userid =  localStorage.getItem("userid");
                 
                 $.ajax({
                        type       : "POST",
                        url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/paynow",
                        contentType: "application/json ",
                        beforeSend : function() {ActivityIndicator.show()},
                        complete   : function() {ActivityIndicator.hide()},
                        data       : '{"user_id": '
                        + userid + '}',
                        dataType   : 'json',
                        success    : function(response) {
                        console.log( JSON.stringify(response));
                        
                        if(response.status=="Success"){
                        var photo = document.getElementById('qrphoto');
                        photo.src = response.qrimage;
                                               }
                        else{
                        
                        }
                        },
                        error      : function(e) {
                        
                        //console.error("error");
                       navigator.notification.alert('Network Error.Try Again', alertDismissed, 'Error', 'OK');                        }
                        });
                 });
function alertDismissed() {
    // do something
}

