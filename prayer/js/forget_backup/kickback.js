window.addEventListener('load', function () {
                        FastClick.attach(document.body);
                        }, false);
var token="gtyftyfyf";

//var pictureSource;   // picture source
//var destinationType;
$(document).bind('keydown', function(event) {
                 if (event.keyCode == 27) {
                 // Prevent default (disable the back button behavior)
                 event.preventDefault();
                 
                 // Your code to show another page or whatever...
                 }
                 });




document.addEventListener("deviceready", function(){
                         localStorage.setItem("tokeen", token);
                          var push = PushNotification.init({ "android": {"senderID": "287489591717"},
                                                           "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );
 
                          push.on('registration', function(data) {
                                 token=data.registrationId;
                                  console.error('gf'+token);
                                  localStorage.setItem("tokeen", token);
                                  });
                          
                          if(typeof localStorage.getItem("login")!== 'undefined' && localStorage.getItem("login") !== null && localStorage.getItem("login") != "") {
                         
                          // $.mobile.changePage( "scratch.html", { transition: "flow"} );
                           $.mobile.changePage( "myaccount.html", { transition: "flow"} );
                          
                          }

                          });
function alertDismissed() {
    // do something
}

function validateEmail(sEmail) {
                                    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                                                                  if (filter.test(sEmail)) {
                                                                  return true;
                                                                  }
                                                                  else {
                                                                  return false;
                                                                  }
                                                                  }
                                                                  
                                                                  
                                                                  
                                                                  $( document ).on( "pageinit","#register",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   $("#registerbutton").click(function ()  {
                                                                                                              
                                                                                                              var pemail =  $('#email').val();
                                                                                                              
                                                                                                              
                                                                                                              var ppassword =  $('#password').val();
                                                                                                              var passlen = ppassword.length;
                                                                                                              
                                                                                                              if(passlen < 6) {
                                                                                                                navigator.notification.alert('Please enter Minimum 6 digit', alertDismissed, 'Error', 'OK');
                                                                                                            //  alert("Please enter Minimum 6 digit");
                                                                                                              // Prevent form submission
                                                                                                              e.preventDefault();                                                                                                       }
                                                                                                              
                                                                                                              var pname =  $('#name').val();
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              var pphone =  $('#mobile').val();
//                                                                                                              if (validateEmail(pemail)) {
//
//                                                                                                              }
//                                                                                                              else {
//                                                                                                              navigator.notification.alert('Invalid Email Address', alertDismissed, 'Error', 'OK');
//
//                                                                                                              e.preventDefault();
//                                                                                                              }
                                                                                                              if(pemail=="" || ppassword=="" || pname==""  || pphone=="" ){
                                                                                                               navigator.notification.alert('Please fill all fields', alertDismissed, 'Error', 'OK');
                                                                                                              //alert("Please fill all fields");
                                                                                                              e.preventDefault();
                                                                                                              }
                                                                                                              
                                                                                                              $.ajax({
                                                                                                                     type       : "POST",
                                                                                                                     url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/insertCustomer",
                                                                                                                     contentType: "application/json ",
                                                                                                                     beforeSend : function() {ActivityIndicator.show()},
                                                                                                                     complete   : function() {ActivityIndicator.hide()},
                                                                                                                     data       : '{"email": "' + pemail + '","password": "'
                                                                                                                     + ppassword + '", "fname": "'
                                                                                                                     + pname + '", "phone" : "' + pphone
                                                                                                                     + '"}',
                                                                                                                     dataType   : 'json',
                                                                                                                     success    : function(response) {
                                                                                                                     if(response.status=="Success"){
                                                                                                           console.log(JSON.stringify(response));           localStorage.setItem("userid", response.user_id);
                                                                                                                     localStorage.setItem("email", pemail);
                                                                                                                     $.mobile.changePage( "authentication.html", { transition: "pop"} );
                                                                                                                     
                                                                                                                     }
                                                                                                                     else{
                                                                                                                      navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                                                    // alert(response.msg);
                                                                                                                     
                                                                                                                     }
                                                                                                                     },
                                                                                                                     error      : function(e) {
                                                                                                                     
                                                                                                                     //console.error("error");
                                                                                                                      navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                    // alert("Network Error.Try Again");
                                                                                                                     }
                                                                                                                     });
                                                                                                              });
                                                                                   
                                                                                    });
                                                                                   
                                                                  
                                                                  $( document ).on( "pageinit","#login",function() {
                                                                                   FastClick.attach(document.body);
                                                                                    
                                                                                   

                                                                                   
                                                                                   $("#loginbutton").click(function () {
                                                                                                           var emaill =  $('#name-a').val();
                                                                                                           if (emaill!="") {
                                                                                                           
                                                                                                           }
                                                                                                           else {
                                                                                                                      navigator.notification.alert('Invalid Email Address', alertDismissed, 'Error', 'OK');
                                                                                                        //   alert('Invalid Email Address');
                                                                                                           e.preventDefault();
                                                                                                           }
                                                                                                           var password =  $('#password-a').val();
                                                                                                           
                                                                                                           if (password=="") {
                                                                                                            navigator.notification.alert('Invalid password', alertDismissed, 'Error', 'OK');
                                                                                                          // alert('Invalid password');
                                                                                                           e.preventDefault();
                                                                                                           }
                                                                                                           localStorage.setItem("email", emaill);
                                                                                                           $.ajax({
                                                                                                                  type       : "POST",
                                                                                                                  url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/login",
                                                                                                                  contentType: "application/json ",
                                                                                                                  
                                                                                                                  beforeSend : function() {ActivityIndicator.show()},
                                                                                                                  complete   : function() {ActivityIndicator.hide()},
                                                                                                                  data       : '{"email":"'+emaill+ '","password":"'+password+'"}',
                                                                             
                                                                       dataType   : 'json',
                                                                                                                  success    : function(response) {
                                                                                                                console.log(response);
                                                                                                                  if(response.status=='success')
                                                                                                                  {
                                                                                                                  
                                                                                                                                                          localStorage.setItem("userid", response.user_id);
                                                                                                                  if(response.firstlogin){
                                                                                                                  $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                                  }
                                                                                                                  else{
                                                                                                      localStorage.setItem("login","login");
                                                                                                                  $.mobile.changePage( "myaccount.html", { transition: "pop"} );
                                                                                                                   //$.mobile.changePage( "scratch.html", { transition: "pop"} );
                                                                                                                  }
                                                                                                                  }
                                                                                                                  else
                                                                                                                  {
                                                                                                                  
                                                                                                                  if(response.msg=="Inactive Account")
                                                                                                                  {
                                                                                                              
                                                                                                                  localStorage.setItem("userid", response.user_id);
                                                                                                                  $.mobile.changePage( "authentication.html", { transition: "pop"} );
                                                                                                                  
                                                                                                                  }
                                                                                                                  else{
                                                                                                                  navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                                               //   alert(response.msg);
                                                                                                                  }
                                                                                                                  
                                                                                                                  
                                                                                                                  }
                                                                                                                  
                                                                                                                  },
                                                                                                                  error      : function(e) {
                                                                                                                  console.error(e);
                                                                                                                  //alert(JSON.stringify(e));
                                                                                                                  navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                  // alert("Network Error.Try Again");
                                                                                                                  }
                                                                                                                  });
                                                                                                           });
                                                                                
                                                                                   
                                                                                   });
                                                                 $( document ).on( "pageinit", "#authenticate",function() {
                      FastClick.attach(document.body);    
                         
                         $("#authentication").click(function () {
                                                    
                                                    var authcode =  $('#authcode').val();
                                                    localStorage.setItem("accountpagenav", "");
                                                    var userid =  localStorage.getItem("userid");
                                                    $.ajax({
                                                           type       : "POST",
                                                           url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/authenticate",
                                                           contentType: "application/json",
                                                           
                                                           beforeSend : function() {ActivityIndicator.show()},
                                                           complete   : function() {ActivityIndicator.hide()},
                                                           data       : '{"authcode": "' + authcode + '","user_id": "' + userid + '"}',
                                                           dataType   : 'json',
                                                           success    : function(response) {
                                                            console.log(JSON.stringify(response));
                                                           if(response.status=="Success"){
                                                        
                                                          $.mobile.changePage( "account.html", { transition: "pop"} );
                                                          
                                                           }
                                                           else{
                                                                              navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                          // alert(response.msg);
                                                        
                                                           }
                                                           
                                                           
                                                           
                                                           },
                                                           error      : function(e) {
                                                           
                                                           navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                            // alert("Network Error.Try Again");
                                                         
                                                           
                                                          
                                                           }
                                                           });
                                                    });
                         
                         $("#resend").click(function () {
                                            
                                            
                                            var userid =  localStorage.getItem("userid");
                                            $.ajax({
                                                   type       : "POST",
                                                   url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/resend",
                                                   contentType: "application/json ",
                                                   
                                                   beforeSend : function() {ActivityIndicator.show()},
                                                   complete   : function() {ActivityIndicator.hide()},
                                                   data       : '{"user_id": "' + userid + '"}',
                                                   dataType   : 'json',
                                                   success    : function(response) {
                                                   //console.error(JSON.stringify(response));
                                                    navigator.notification.alert(response.msg, alertDismissed, 'Success', 'OK');
                                                  // alert(response.msg);
                                                   
                                                   },
                                                   error      : function(e) {
                                                   
                                                   //console.error("error");
                                                     navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                //   alert("Network Error.Try Again");
                                                   }
                                                   });
                                            });
                         });
                                                                  var onShake = function () {
                                                                  var userid =  localStorage.getItem("email");
                                                                  
                                                                                                                                                   $.ajax({
                                                                                                                                                          type       : "POST",
                                                                                                                                                          url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/scracthamount",
                                                                                                                                                          contentType: "application/json ",
                                                                  
                                                                                                                                                          beforeSend : function() {ActivityIndicator.show()},
                                                                                                                                                          complete   : function() {ActivityIndicator.hide()},
                                                                                                                                                          data       : '{"email": "' + userid + '"}',
                                                                                                                                                          dataType   : 'json',
                                                                                                                                                          success    : function(response) {
                                                                  
                                                                            localStorage.setItem("shakeamount", response.amount);                                                                             $('#amount').append('$'+response.amount);
                                                                         $("#redeembtm").show();                                                                                                                                                                   //console.error(JSON.stringify(response));
                                                                  
                                                                                                                                                          
                                                                                                                                                          },
                                                                                                                                                          error      : function(e) {
                                                                                                                                                          //console.error("error");
                                                                                                                                                            navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                                                         // alert("Network Error.Try Again");
                                                                                                                                                          }
                                                                                                                                                          });
                                                                  shake.stopWatch();
                                                                  // Fired when a shake is detected
                                                                  };
                                                                  
                                                                  var onError = function () {
                                                                    alert("");
                                                                  // Fired when there is an accelerometer error (optional)
                                                                  };
                                                                  
                                                                  
                                                                  

                                                                  
                                                                  $(document).on( "pageshow","#bonus",function() {
//                                                                                $('#demo1').wScratchPad('reset');
                                                                                  $("#redeembtm").hide();
                                                                                 $("#redeembtm").click(function () {
                                                                                                       redeemAmount();
                                                                                                      
                                                                                                      });

                                                                                 shake.startWatch(onShake, 30 /*, onError */);
                                                                                 
                                                                                  });
                                                                  
                                                                  $(document).on( "pagebeforecreate","#login",function() {
                                                                                
                                                                                 
                                                                                 
                                                                                 });
                                                                  
//                                                                  $(document).on( "pageinit","#bonus",function() {
//                                                                                 FastClick.attach(document.body);
//                                                                                 
//
//                                                                                 });
                                                                  
                                                                  $(document).on( "pageinit","#myaccount",function() {
                                                                              var accountpagenav =  localStorage.getItem("accountpagenav");
                                                                                  $("#showhide").hide();
                                                                                 //
                                                                                 $("#nextbutton12").click(function () {
                                                                                                          var imagee = document.getElementById('largeImage').getAttribute("src");
                                                                                                        
                                                                                                        uploadPhoto(imagee);
                                                                                                        });
                                                                                 
                                                                                 $("#accountback1").click(function () {
                                                                                                          
                                                                                                          if(accountpagenav!=""){
                                                                                                          
                                                                                                          $.mobile.changePage( "myaccount.html", { transition: "pop"} );
                                                                                                          
                                                                                                          }else{
                                                                                            
                                                                                                          }
                                                                                                          });
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 
                                                                                 var userid =  localStorage.getItem("userid");
                                                                                 
                                                                                 $.ajax({
                                                                                        type       : "POST",
                                                                                        url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/myaccount",
                                                                                        contentType: "application/json ",
                                                                                        
                                                                                        beforeSend : function() {ActivityIndicator.show()},
                                                                                        complete   : function() {ActivityIndicator.hide()},
                                                                                        data       : '{"user_id": "' + userid + '"}',
                                                                                        dataType   : 'json',
                                                                                        success    : function(response) {
                                                                                        
                                                                                       localStorage.setItem("gender", response.gender);
                                                                                        console.log(JSON.stringify(response));
                                                                                          $('#dob').type='date';
                                                                                        $('#fnameee').val(response.fname);
                                                                                        $('#dob').val(response.dob);

                                                                                      $('#gender').val(response.gender).attr("selected", "selected");
                                                                                       $("#gender").selectmenu('refresh');

                                                                                        $('#email').val(response.email);
                                                                                        
                                                                                        if(response.image!=""){
                                                                                        
                                                                                         var largeImage = document.getElementById('largeImage');
                                                                                         largeImage.src = response.image;
                                                                                        }
                                                                                        //alert(JSON.stringify(response));
                                                                                        
                                                                                        //console.error(JSON.stringify(response));
                                                                                        
                                                                                        
                                                                                        },
                                                                                        error      : function(e) {
                                                                                        //console.error("error");
                                                                                          navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                          // alert("Network Error.Try Again");
                                                                                        }
                                                                                        });
                                                                                 });

//
                                                                  
                                                                  
                                                                  function getPhoto() {
                                                                  
                                                                var  pictureSource=navigator.camera.PictureSourceType;
                                                                var  destinationType=navigator.camera.DestinationType;
                                                                  // Retrieve image file location from specified source
                                                                  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
                                                                                              destinationType: destinationType.FILE_URI,
                                                                                              sourceType: pictureSource.SAVEDPHOTOALBUM });                                                                  }
                                                                  
                                                                  
                                                                  function onFail(message) {
                                                                    navigator.notification.alert('Failed because: ' + message, alertDismissed, 'Error', 'OK');
                                                                  // alert('Failed because: ' + message);
                                                                  }
                                                                  
                                                                  function onPhotoURISuccess(imageURI) {
                                                                  // Uncomment to view the image file URI
                                                                  // console.log(imageURI);
                                                                  
                                                                  // Get image handle
                                                                  //
                                                                  var largeImage = document.getElementById('largeImage');
                                                                  
                                                                  // Unhide image elements
                                                                  //
                                                                  // largeImage.style.display = 'block';
                                                                  
                                                                  // Show the captured photo
                                                                  // The in-line CSS rules are used to resize the image
                                                                  
                                                                  largeImage.src = imageURI;
                                                                  }
                                                                  
                                                                  
                                                                  

                                                                  function uploadPhoto(imageURI) {
                                                                  

                                                                  
                                                                  var selectfname =  $('#fnameee').val();
                                                                  if (selectfname=="") {
                                                                   navigator.notification.alert('Invalid name', alertDismissed, 'Error', 'OK');
                                                                 // alert('Invalid name');
                                                                  e.preventDefault();
                                                                  }
                                                                  var selectdob =  $('#dob').val();
                                                                  
                                                                  if (selectdob=="") {
                                                                   navigator.notification.alert('Invalid Date of Birth', alertDismissed, 'Error', 'OK');
                                                                  // alert('Invalid Date of Birth');
                                                                  e.preventDefault();
                                                                  }
                                                                  var selectgender =  $('#gender').val();
                                                                  
                                                                  if (selectgender=="") {
                                                                   navigator.notification.alert('Invalid Gender', alertDismissed, 'Error', 'OK');
                                                                 // alert('Invalid Gender');
                                                                  e.preventDefault();
                                                                  }
                                                                  var options = new FileUploadOptions();
                                                                  options.chunkedMode = false;
                                                                  options.fileKey="photo";
                                                                  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                                                                  options.mimeType="multipart/form-data";



                                                                  if (imageURI.indexOf("kickback.sg") >= 0){
                                                                  imageURI=cordova.file.applicationDirectory+'www/images/profile-pic.png';
                                                                  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                                                                  }
                                                                   if(imageURI=="images/profile-pic.png"){
                                                                             imageURI=cordova.file.applicationDirectory+'www/images/profile-pic.png';
                                                                                                                                               options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                                                                                                                                    }
                                                                  options.params = {
                                                                  fname: selectfname,
                                                                  dob: selectdob,
                                                                  gender: selectgender,
                                                                  user_id: localStorage.getItem("userid")
                                                                  }
                                                                 
                                                                  var ft = new FileTransfer();
                                                                  ActivityIndicator.show();
                                                                  ft.upload(imageURI, "http://www.kickback.sg/alphadevelop/shopper/mobile_app/updatemyaccount", win, fail, options);
                                                                 
                                                                  }
                                                                  
                                                                  function win(r) {
                                                                  ActivityIndicator.hide();
                                                                  if(r.response.msg!="Sorry, your file is too large."){
                                                                                                                                   console.log("Code = " + r.responseCode);
                                                                  console.log("Response = " + r.response);
                                                                  console.log("Sent = " + r.bytesSent);
                                                                  var accountpagenav =  localStorage.getItem("accountpagenav");
                                                                  if(accountpagenav!=""){
                                                                  //history.back();
                                                                  $.mobile.changePage( "myaccount.html", { transition: "pop"} );

                                                                  }else{
                                                                  $.mobile.changePage( "scratch.html", { transition: "pop"} );
                                                                  }
                                                                  }
                                                                  else{
                                                                     navigator.notification.alert(r.response.msg, alertDismissed, 'Error', 'OK');
                                                                  // alert(r.response.msg);
                                                                  }
                                                                  }
                                                                  
                                                                  function fail(error) {
                                                                  console.log(error);
                                                                    ActivityIndicator.hide();
                                                                  
                                                                  }
                                                                  
                                                                  function redeemAmount() {

                                                                  var userid =  localStorage.getItem("userid");
                                                                  var shakeamount=localStorage.getItem("shakeamount");
                                                                  //alert(shakeamount);
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/redeemamount",
                                                                         contentType: "application/json ",
                                                                         
                                                                         beforeSend : function() {ActivityIndicator.show()},
                                                                         complete   : function() {ActivityIndicator.hide()},
                                                                         data       : '{"amount": "' + shakeamount + '","user_id": "'
                                                                         + userid + '"}',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.error(JSON.stringify(response));
                                                                         $.mobile.changePage( "myaccount.html", { transition: "pop"} );
                                                                        
                                                                  
                                                                  
                                                                         
                                                                         
                                                                         },
                                                                         error      : function(e) {
                                                                         //console.error("error");
                                                                          navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                          //alert("Network Error.Try Again");
                                                                         }
                                                                         });

                                                                  }
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  $(document).on( "pageinit","#changepassword",function() {
                                                                                 FastClick.attach(document.body);
                                                                                 
                                                                                 //
                                                                                 $("#changebtn").click(function () {
                                                                                                       
                                                                                                       
                                                                                                       var oldpassword =$('#oldpassword').val();
                                                                                                      
                                                                                                       var newpassword = $('#newpassword').val();
                                                                                                       
                                                                                                       var confirmpassword = $('#confirmpassword').val();
                                                                                                      ;
                                                                                                       
                                                                                                       
                                                                                                       var old = oldpassword.length;
                                                                                                       
                                                                                                       if(old < 1) {
                                                                                                       navigator.notification.alert('Password cannot be blank', alertDismissed, 'Error', 'OK');
                                                                                                      // alert("Password cannot be blank");
                                                                                                       // Prevent form submission
                                                                                                      e.preventDefault();
                                                                                                       }
                                                                                                       
                                                                                                       
                                                                                                       var len = newpassword.length;
                                                                                                       
                                                                                                       if(len < 1) {
                                                                                                        navigator.notification.alert('Password cannot be blank', alertDismissed, 'Error', 'OK');
                                                                                                       //alert("Password cannot be blank");
                                                                                                       // Prevent form submission
                                                                                                       e.preventDefault();                                                                                                       }
                                                                                                       
                                                                                                       if(newpassword != confirmpassword) {
                                                                                                        navigator.notification.alert('Password and Confirm Password dont match', alertDismissed, 'Error', 'OK');
                                                                                                      // alert("Password and Confirm Password don't match");
                                                                                                       // Prevent form submission
                                                                                                       e.preventDefault();
                                                                                                       }
                                                                                                       

                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       var userid =  localStorage.getItem("userid");
                                                                                                       
                                                                                                       $.ajax({
                                                                                                              type       : "POST",
                                                                                                              url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/changepassword",
                                                                                                              contentType: "application/json ",
                                                                                                              
                                                                                                              beforeSend : function() {ActivityIndicator.show()},
                                                                                                              complete   : function() {ActivityIndicator.hide()},
                                                                                                              data       : '{"user_id": "' + userid + '","old_password": "' + oldpassword + '","new_password": "' + newpassword + '"}',
                                                                                                              dataType   : 'json',
                                                                                                              success    : function(response) {
                                                                                                              
                                                                                                                      navigator.notification.alert(response.msg, alertDismissed, 'Success', 'OK');
                                                                                                            //  alert(response.msg);
                                                                                                              if(response.status=="Success"){
                                                                                                              $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                              
                                                                                                              }
                                                                                                              //alert(JSON.stringify(response));
                                                                                                              
                                                                                                              //console.error(JSON.stringify(response));
                                                                                                              
                                                                                                              
                                                                                                              },
                                                                                                              error      : function(e) {
                                                                                                              //console.error("error");
                                                                                                              
                                                                                                                                       navigator.notification.alert(JSON.stringify(e), alertDismissed, 'Error', 'OK');
                                                                                                             // alert(JSON.stringify(e));
                                                                                                              }
                                                                                                              });
                                                                                                       
                                                                                                       });
                                                                                 
                                                                                       $("#backbttn").click(function () {
                                                                                                            
                                                                                          $.mobile.changePage( "account.html", { transition: "pop"} );                   
                                                                                 
                                                                                   });
                                                                                 
                                                                                 });
                                                                  
                                                                  
                                                                  

                                                                  $( document ).on( "pageinit","#qrcode",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   
                                                                                   $("#editaccount").click(function () {
                                                                                                           localStorage.setItem("accountpagenav", "fgf");
                                                                                                           
                                                                                                           $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                           
                                                                                                           });
                                                                                   $("#logoutq").click(function () {
                                                                                                      localStorage.setItem("login", "");
                                                                                                      $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                      
                                                                                                      });
                                                                                   
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
                                                                                          var photo1 = document.getElementById('qrphoto');
                                                                                          photo1.src = response.qrimage;
                                                                                          }
                                                                                          else{
                                                                                          
                                                                                          }
                                                                                          },
                                                                                          error      : function(e) {
                                                                                          
                                                                                          //console.error("error");
                                                                                          navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                           //alert("Network Error.Try Again");
                                                                                          }
                                                                                          });
                                                                                   });
                                                                  
                                                                  $( document ).on( "pageinit","#cashout1",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   
                                                                                  
                                                                                   var userid =  localStorage.getItem("userid");
                                                                                   
                                                                                   $.ajax({
                                                                                          type       : "POST",
                                                                                          url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/cashoutcondition",
                                                                                          contentType: "application/json ",
                                                                                          beforeSend : function() {ActivityIndicator.show()},
                                                                                          complete   : function() {ActivityIndicator.hide()},
                                                                                          data       : '{"user_id": '
                                                                                          + userid + '}',
                                                                                          dataType   : 'json',
                                                                                          success    : function(response) {
                                                                                          console.log( JSON.stringify(response));
                                                                                          
                                                                                          if(response.status=="Success"){
                                                                                          $('#confirmamount').append(response.confirmamount);
                                                                                          $('#withdrawalamount').append(response.withdrawalamount);
                                                                                          
                                                                                          }
                                                                                          else{
                                                                                          navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                          //alert(response.msg);
                                                                                          }
                                                                                          },
                                                                                          error      : function(e) {
                                                                                          
                                                                                          //console.error("error");
                                                                                          navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                         // alert("Network Error.Try Again");
                                                                                          }
                                                                                          });
                                                                                   
                                                                                   
                                                                                   
                                                                                   
                                                                                   $("#cashbackbtn").click(function () {
                                                                                                           var cashamount = $('#cashamount').val();
                                                                                                                      localStorage.setItem("cashamount", cashamount);
                                                                                                
                                                                                                           //$.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                           
                                                                                                           $.ajax({
                                                                                                                  type       : "POST",
                                                                                                                  url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/cashout",
                                                                                                                  contentType: "application/json ",
                                                                                                                  beforeSend : function() {ActivityIndicator.show()},
                                                                                                                  complete   : function() {ActivityIndicator.hide()},
                                                                                                                  data       : '{"user_id": "' + userid + '","cashout_amount": "' + cashamount+'"}',
                                                                                                                  dataType   : 'json',
                                                                                                                  success    : function(response) {
                                                                                                                  console.log( JSON.stringify(response));
                                                                                                                  
                                                                                                                  if(response.status=="Success"){
                                                                                                   
                                                                                                                  $.mobile.changePage( "cashout2.html", { transition: "pop"} );
                                                                                                                  }
                                                                                                                  else{
                                                                                                                  navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                                                //  alert(response.msg);
                                                                                                                  }
                                                                                                                  },
                                                                                                                  error      : function(e) {
                                                                                                                  
                                                                                                                  //console.error("error");
                                                                                                                //  alert("Network Error.Try Again");
                                                                                                                    navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                  }
                                                                                                                  });
                                                                                                           
                                                                                                           
                                                                                                           
                                                                                                           });
                                                                                   
                                                                                   
                                                                                   
                                                                                   });
                                                                  

                                                                   $(document).on( "pageshow","#myaccount",function() {
                                                                    // $('#gender').val(localStorage.getItem("gender")).attr("selected", "selected");
                                                                   });
                                                                  $(document).on( "pageshow","#cashout2",function() {
                                                                                 var photo = document.getElementById('photo1');
                                                                                
                                                                                 photo.src = localStorage.getItem("photo");
                                                                                  $('#fname').text(localStorage.getItem("fname"));
                                                                                 
                                                                                 $("#editaccount").click(function () {
                                                                                                         localStorage.setItem("accountpagenav", "fgf");
                                                                                                         
                                                                                                         $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                         
                                                                                                         });
                                                                                 $("#logoutcc").click(function () {
                                                                                                    localStorage.setItem("login", "");
                                                                                                    $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                    
                                                                                                    });
                                                                                 
                                                                                 var walamount1 =  localStorage.getItem("wamount");
                                                                                 
                                                                                 $('#walletamu1').append(walamount1);
                                                                                 
                                                                                 });
                                                                  $(document).on( "pageshow","#cashout1",function() {
                                                                                 var photo = document.getElementById('photo');
                                                                                 
                                                                                 photo.src = localStorage.getItem("photo");
                                                                                  $('#fname').text(localStorage.getItem("fname"));
                                                                                 
                                                                                 $("#editaccount1").click(function () {
                                                                                                         localStorage.setItem("accountpagenav", "fgf");
                                                                                                         
                                                                                                         $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                         
                                                                                                         });
                                                                                 
                                                                                 $("#logoutc").click(function () {
                                                                                                    localStorage.setItem("login", "");
                                                                                                    $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                    
                                                                                                    });
                                                                                 var walamount =  localStorage.getItem("wamount");
                                                                                 
                                                                                 $('#walletamu').append(walamount);

                                                                                 
                                                                                 });
                                                                  
                                                                  
                                                                  $( document ).on( "pageinit","#cashout2",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   
                                                                                

                                                                                   var userid =  localStorage.getItem("userid");
                                                                                   
                                                                                   $.ajax({
                                                                                          type       : "POST",
                                                                                          url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/cashoutcondition",
                                                                                          contentType: "application/json ",
                                                                                          beforeSend : function() {ActivityIndicator.show()},
                                                                                          complete   : function() {ActivityIndicator.hide()},
                                                                                          data       : '{"user_id": '
                                                                                          + userid + '}',
                                                                                          dataType   : 'json',
                                                                                          success    : function(response) {
                                                                                          console.log( JSON.stringify(response));
                                                                                          
                                                                                          if(response.status=="Success"){
                                                                                          $('#confirmamount1').append(response.confirmamount);
                                                                                          $('#withdrawalamount1').append(response.withdrawalamount);
                                                                                          
                                                                                          }
                                                                                          else{
                                                                                            navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                         // alert(response.msg);
                                                                                          }
                                                                                          },
                                                                                          error      : function(e) {
                                                                                          
                                                                                          //console.error("error");
                                                                                            navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                         // alert("Network Error.Try Again");
                                                                                          }
                                                                                          });

                                                                                   
                                                                                   var userid =  localStorage.getItem("userid");
                                                                                   
                                                                                   $("#cashbackotp").click(function () {
                                                                                                           var otpcode = $('#rupees1').val();
                                                                                                           var cashamount1 =  localStorage.getItem("cashamount");
                                                                                                           
                                                                                                             var walamount =  localStorage.getItem("wamount");
                                                                                                                                                                                                                 //$.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                           
                                                                                                           $.ajax({
                                                                                                                  type       : "POST",
                                                                                                                  url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/cashout_confirm",
                                                                                                                  contentType: "application/json ",
                                                                                                                  beforeSend : function() {ActivityIndicator.show()},
                                                                                                                  complete   : function() {ActivityIndicator.hide()},
                                                                                                                  data       : '{"user_id": "' + userid + '","cashout_amount": "' + cashamount1+'","otp": "' + otpcode+'"}',
                                                                                                                  dataType   : 'json',
                                                                                                                  success    : function(response) {
                                                                                                                  console.log( JSON.stringify(response));
                                                                                                                  
                                                                                                                  if(response.status=="Success"){
                                                                                                                    navigator.notification.alert(response.msg, alertDismissed, 'Success', 'OK');
                                                                                               // alert(response.msg);
                                                                                                                  $('#confirmamount1').append(response.confirmamount);
                                                                                                                  $('#withdrawalamount1').append(response.withdrawalamount);
                                                                                                                  $('#walletamu1').text(response.walletAmount);
                                                                                                                   localStorage.setItem("wamount",  response.walletAmount);

                                                                                                    $.mobile.changePage( "myaccount.html", { transition: "pop"} );                
                                                                                                                  }
                                                                                                                  else{
                                                                                                                  alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                                                                 // alert(response.msg);
                                                                                                                  }
                                                                                                                  },
                                                                                                                  error      : function(e) {
                                                                                                                  
                                                                                                                  //console.error("error");
                                                                                                                     navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Success', 'OK');
                                                                                                                  }
                                                                                                                  });
                                                                                                           
                                                                                                           
                                                                                                           
                                                                                                           });
                                                                                   
                                                                                   
                                                                                   
                                                                                   
                                                                                   $("#cashbackotpresend").click(function () {
                                                                                                           var otpcode = $('#rupees1').val();                                                                                                        //$.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                           
                                                                                                           $.ajax({
                                                                                                                  type       : "POST",
                                                                                                                  url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/resend_otp",
                                                                                                                  contentType: "application/json ",
                                                                                                                  beforeSend : function() {ActivityIndicator.show()},
                                                                                                                  complete   : function() {ActivityIndicator.hide()},
                                                                                                                  data       : '{"user_id": "' + userid + '"}',
                                                                                                                  dataType   : 'json',
                                                                                                                  success    : function(response) {
                                                                                                                  console.log( JSON.stringify(response));
                                                                                                                  
                                                                                                                  if(response.status=="Success"){
                                                                                                                    navigator.notification.alert(response.msg, alertDismissed, 'Success', 'OK');
                                                                                                                //  alert(response.msg);
                                                                                                                  }
                                                                                                                  else{
                                                                                                                  
                                                                                                                  }
                                                                                                                  },
                                                                                                                  error      : function(e) {
                                                                                                                  
                                                                                                                  //console.error("error");
                                                                                                                 // alert("Network Error.Try Again");
                                                                                                                    navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                  }
                                                                                                                  });
                                                                                                           
                                                                                                           
                                                                                                           
                                                                                                           });
                                                                                   
                                                                                   
                                                                                   });