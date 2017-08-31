
                                                                  $(document).on( "pageinit","#changepassword",function() {
                                                                                 FastClick.attach(document.body);
                                                                                 alert("Please enter your password");
                                                                                 //
                                                                                 $("#changebtn").click(function () {
                                                                                                        
                                                                                                        
                                                                                                        var oldpassword = document.getElementById('oldpassword');
                                                                                                        
                                                                                                        var newpassword = document.getElementById('newpassword');
                                                                                                        var confirmpassword = document.getElementById('confirmpassword');
                                                                                 
                                                                                 
                                                                                                       
                                                                                                       var old = oldpassword.length;
                                                                                                       
                                                                                                       if(old < 1) {
                                                                                                       alert("Please enter your current password");
                                                                                                       // Prevent form submission
                                                                                                       event.preventDefault();
                                                                                                       }

                                                                                                       
                                                                                                       var len = newpassword.length;
                                                                                                       
                                                                                                       if(len < 1) {
                                                                                                       alert("Please enter your new password");
                                                                                                       // Prevent form submission
                                                                                                       event.preventDefault();
                                                                                                       }
                                                                                                       
                                                                                                       if(newpassword != confirmpassword) {
                                                                                                       alert("Password does not match with the confirm password");
                                                                                                       // Prevent form submission
                                                                                                       event.preventDefault();
                                                                                                       }
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 var userid =  localStorage.getItem("userid");
                                                                                 
                                                                                 $.ajax({
                                                                                        type       : "POST",
                                                                                        url        : "http://www.kickback.sg/shopper/mobile_app/changepassword",
                                                                                        contentType: "application/json ",
                                                                                        
                                                                                        beforeSend : function() {ActivityIndicator.show()},
                                                                                        complete   : function() {ActivityIndicator.hide()},
                                                                                        data       : '{"user_id": "' + userid + '","old_password": "' + oldpassword + '","new_password": "' + newpassword + '"}',
                                                                                        dataType   : 'json',
                                                                                        success    : function(response) {
                                                                                     
                                                                                        //alert(JSON.stringify(response));
                                                                                        
                                                                                        //console.error(JSON.stringify(response));
                                                                                        
                                                                                        
                                                                                        },
                                                                                        error      : function(e) {
                                                                                        //console.error("error");
                                                                                        navigator.notification.alert('The operation could not be completed, please try again', alertDismissed, 'Error', 'OK');
                                                                                        }
                                                                                        });
                                                                                 });
                                                                                 
                                                                            });


function alertDismissed() {
    // do something
}

