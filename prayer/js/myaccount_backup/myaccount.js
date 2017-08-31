window.addEventListener('load', function () {
                        FastClick.attach(document.body);
                        }, false);
//var pictureSource;   // picture source
//var destinationType;
$(document).bind('keydown', function(event) {
                 if (event.keyCode == 27) {
                 // Prevent default (disable the back button behavior)
                 event.preventDefault();
                 
                 // Your code to show another page or whatever...
                 }
                 });
 var merchantResponse;

function validateEmail(sEmail) {
                                    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                                                                  if (filter.test(sEmail)) {
                                                                  return true;
                                                                  }
                                                                  else {
                                                                  return false;
                                                                  }
                                                                  }
                                                                  
                                                                  $( document ).on( "pageshow","#home",function() {
                                                                                   
                                                                                   pushregister();
                                                                                   
                                                                                   });
                                                                  
                                                                  $( document ).on( "pageinit","#home",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   
                                                                                  
                                                                                  
                                                                                   
                                                                                   $("#editaccount").click(function () {
                                                                                                           localStorage.setItem("accountpagenav", "fgf");
                                                                                                           
                                                                                                      $.mobile.changePage( "account.html", { transition: "pop"} );
                                                                                                      
                                                                                                      });
                                                                                   $("#logout").click(function () {
                                                                                                         localStorage.setItem("login", "");
                                                                                                        $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                        
                                                                                                        });
         

                                                                             var userid =  localStorage.getItem("userid");      
                                                                                 
                                                                $.ajax({
                                                                                                                     type       : "POST",
                                                                                                                     url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/account",
                                                                                                                     contentType: "application/json ",
                                                                                                                     beforeSend : function() {ActivityIndicator.show()},
                                                                                                                     complete   : function() {ActivityIndicator.hide()},
                                                                       data       : '{"user_id": '
                                                                       + userid + '}',
                                                                                                                     dataType   : 'json',
                                                                                                                     success    : function(response) {
                                                                       console.log( JSON.stringify(response));
                                                                       
                                                                                                                     if(response.status=="Success"){
                                                                       var photo = document.getElementById('photo');
                                                                       photo.src = response.profilepic;
                                                                       $('#walletamount').append(response.walletAmount);
                                                                         $('#pendingamount').append(response.pendingAmount);
                                                                         $('#points').append(response.points);
                                                                        $('#name').append(response.name);
                                                                       localStorage.setItem("fname",  response.name);
                                                                       localStorage.setItem("photo",  response.profilepic);
                                                                        localStorage.setItem("wamount",  response.walletAmount);
                                                                      $.each(response.lastvisit, function(k, s) {
                                                                       $.each(response.lastvisit.lastvisit, function(k, s) {
                                                                              
                                                                              var myDivAcc  =$('<li><img src="'+s.image+'"></li>');
                                                                               $('#recentvisit').append(myDivAcc);

                                                                              });
                                                                             });

                                                                                                                     }
                                                                                                                     else{
                                                                                                                     
                                                                                                                     }
                                                                                                                     },
                                                                                                                     error      : function(e) {
                                                                                                                  
                                                                                                                     //console.error("error");
                                                                       navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                       
                                                                                                                     }
                                                                                                                     });
                                                                                                              });
                                                                                   
                                                                                  
                                                                  $( document ).on( "pageinit","#shoppinglist",function() {
                                                                                   FastClick.attach(document.body);
                                                                                  
                                                                                
                                                                                   $("#logout1").click(function () {
                                                                                                      localStorage.setItem("login", "");
                                                                                                      $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                      
                                                                                                      });
                                                                                   $("#radio-drop1").click(function(){
                                                                                                           $(".radio-drop").toggle("slide");                                                                                      })
                                                                                   
    
                                                                                   
                                                                                   
                                                                                   
                                                                                  

                                                                                  
                                                                                   
                                                                                   merchantapi();
                                                                                   
                                                                                   
                                                                         $("#recent").click(function () {
                                                                                           $(".radio-drop").slideDown("fast");
                                                                                             var userid =  localStorage.getItem("userid");
                                                                                             
                                                                                             $.ajax({
                                                                                                    type       : "POST",
                                                                                                    url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/merchants",
                                                                                                    contentType: "application/json ",
                                                                                                    beforeSend : function() {ActivityIndicator.show()},
                                                                                                    complete   : function() {ActivityIndicator.hide()},
                                                                                                    data       : '{"user_id": "' + userid + '","sort_by": "fv"}',
                                                                                                    dataType   : 'json',
                                                                                                    success    : function(response) {
                                                                                                    console.log( JSON.stringify(response));
                                                                                                    
                                                                                                    if(response.status=="Success"){
                                                                                                     merchantResponse=response.merchants;
                                                                                              
                                                                                                    
                                                                                                   // alert("frtyt");
                                                                                                     $( "#walletamount1" ).empty();
                                                                                                    
                                                                                                    $('#walletamount1').append(response.walletAmount);
                                                                                                    $( "#merchantlist" ).empty();
                                                                                                    $.each(response.merchants, function(k, v) {
                                                                                                           
                                                                                                           if(v.fav==""){
                                                                                                           var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                             +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                             +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                             +' </div>'
                                                                                                                             +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                             
                                                                                                                            // +' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                             +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                             +' <span class="shop-heart si">'
                                                                                                                             +'<i class="fa fa-heart-o"></i>'
                                                                                                                             +' </span>'
                                                                                                                             +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                             +' <span class="shop-eye si">'
                                                                                                                             +' <i class="fa fa-eye"></i>'
                                                                                                                             +' </span>'
                                                                                                                             +' </div>'
                                                                                                                             +' </div>'
                                                                                                                             +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                             +' <span class="cs1">Cashback</span>'
                                                                                                                             +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                             +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                             +'   </div>'
                                                                                                                             +'  </li>');
                                                                                                           }
                                                                                                           else{
                                                                                                           var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                             +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                             +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                             +' </div>'
                                                                                                                             +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                             
                                                                                                                             //+' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                             +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                             +' <span class="shop-heart si">'
                                                                                                                             +'<i class="fa fa-heart"></i>'
                                                                                                                             +' </span>'
                                                                                                                             +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                             +' <span class="shop-eye si">'
                                                                                                                             +' <i class="fa fa-eye"></i>'
                                                                                                                             +' </span>'
                                                                                                                             +' </div>'
                                                                                                                             +' </div>'
                                                                                                                             +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                             +' <span class="cs1">Cashback</span>'
                                                                                                                             +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                             +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                             +'   </div>'
                                                                                                                             +'  </li>');
                                                                                                           }
                                                                                                           
                                                                                                           $('#merchantlist').append(mySecondDiv);
                                                                                                           
                                                                                                           });
                                                                                                    
                                                                                                    }
                                                                                                    else{
                                                                                                   
                                                                                                    }
                                                                                                    },
                                                                                                    error      : function(e) {
                                                                                                   
                                                                                                    //console.error("error");
                                                                                                   navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                    }
                                                                                                    });
                                                                                          
                                                                                              });
                                                                                   
                                                                                   
                                                                                   
                                                                                   $("#all").click(function () {
                                                                                                   $(".radio-drop").slideDown("fast");  
                                                                                                    var userid =  localStorage.getItem("userid");
                                                                                                    
                                                                                                    $.ajax({
                                                                                                           type       : "POST",
                                                                                                           url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/merchants",
                                                                                                           contentType: "application/json ",
                                                                                                           beforeSend : function() {ActivityIndicator.show()},
                                                                                                           complete   : function() {ActivityIndicator.hide()},
                                                                                                           data       : '{"user_id": "' + userid + '","sort_by": "hc"}',
                                                                                                           dataType   : 'json',
                                                                                                           success    : function(response) {
                                                                                                           console.log( JSON.stringify(response));
                                                                                                           
                                                                                                           if(response.status=="Success"){
                                                                                                           
                                                                                                           
                                                                                                            merchantResponse=response.merchants;
                                                                                                           
                                                                                                            $( "#walletamount1" ).empty();
                                                                                                           
                                                                                                           $('#walletamount1').append(response.walletAmount);
                                                                                                           $( "#merchantlist" ).empty();
                                                                                                         
                                                                                                           $.each(response.merchants, function(k, v) {
                                                                                                                  
                                                                                                                  if(v.fav==""){
                                                                                                                  var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                                    +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                                    +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                                    +' </div>'
                                                                                                                                    +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                                    
                                                                                                                                    //+' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                                    +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                                    +' <span class="shop-heart si">'
                                                                                                                                    +'<i class="fa fa-heart-o"></i>'
                                                                                                                                    +' </span>'
                                                                                                                                    +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                                    +' <span class="shop-eye si">'
                                                                                                                                    +' <i class="fa fa-eye"></i>'
                                                                                                                                    +' </span>'
                                                                                                                                    +' </div>'
                                                                                                                                    +' </div>'
                                                                                                                                    +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                                    +' <span class="cs1">Cashback</span>'
                                                                                                                                    +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                                    +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                                    +'   </div>'
                                                                                                                                    +'  </li>');
                                                                                                                  }
                                                                                                                  else{
                                                                                                                  var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                                    +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                                    +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                                    +' </div>'
                                                                                                                                    +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                                    
                                                                                                                                   // +' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                                    +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                                    +' <span class="shop-heart si">'
                                                                                                                                    +'<i class="fa fa-heart"></i>'
                                                                                                                                    +' </span>'
                                                                                                                                    +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                                    +' <span class="shop-eye si">'
                                                                                                                                    +' <i class="fa fa-eye"></i>'
                                                                                                                                    +' </span>'
                                                                                                                                    +' </div>'
                                                                                                                                    +' </div>'
                                                                                                                                    +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                                    +' <span class="cs1">Cashback</span>'
                                                                                                                                    +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                                    +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                                    +'   </div>'
                                                                                                                                    +'  </li>');
                                                                                                                  }
                                                                                                                  
                                                                                                                  $('#merchantlist').append(mySecondDiv);
                                                                                                                  
                                                                                                                  
                                                                                                                  });
                                                                                                           }
                                                                                                           else{
                                                                                                           
                                                                                                           }
                                                                                                           },
                                                                                                           error      : function(e) {
                                                                                                           
                                                                                                           //console.error("error");
                                                                                                           navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                           }
                                                                                                           });
                                                                                                    
                                                                                                    });
                            
                                                                                   
                                      
                                                                                   
                                                                                   
                                                                                   $("#week").click(function () {
                                                                                                 $(".radio-drop").slideDown("fast");
                                                                                                         var userid =  localStorage.getItem("userid");
                                                                                                         
                                                                                                         $.ajax({
                                                                                                                type       : "POST",
                                                                                                                url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/merchants",
                                                                                                                contentType: "application/json ",
                                                                                                                beforeSend : function() {ActivityIndicator.show()},
                                                                                                                complete   : function() {ActivityIndicator.hide()},
                                                                                                                data       : '{"user_id": "' + userid + '","sort_by": "hj"}',
                                                                                                                dataType   : 'json',
                                                                                                                success    : function(response) {
                                                                                                                console.log( JSON.stringify(response));
                                                                                                                
                                                                                                                if(response.status=="Success"){
                                                                                                                
                                                                                                                
                                                                                                                
                                                                                                                
                                                                                                                 $( "#walletamount1" ).empty();
                                                                                                                
                                                                                                                $('#walletamount1').append(response.walletAmount);
                                                                                                                $( "#merchantlist" ).empty();
                                                                                                                
                                                                                                                $.each(response.merchants, function(k, v) {
                                                                                                                       if(v.fav==""){
                                                                                                                       var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                                         +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                                         +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                                         +' </div>'
                                                                                                                                         +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                                         
                                                                                                                                         //+' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                                         +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                                         +' <span class="shop-heart si">'
                                                                                                                                         +'<i class="fa fa-heart-o"></i>'
                                                                                                                                         +' </span>'
                                                                                                                                         +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                                         +' <span class="shop-eye si">'
                                                                                                                                         +' <i class="fa fa-eye"></i>'
                                                                                                                                         +' </span>'
                                                                                                                                         +' </div>'
                                                                                                                                         +' </div>'
                                                                                                                                         +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                                         +' <span class="cs1">Cashback</span>'
                                                                                                                                         +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                                         +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                                         +'   </div>'
                                                                                                                                         +'  </li>');
                                                                                                                       }
                                                                                                                       else{
                                                                                                                       var mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                                                         +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                                                         +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                                                         +' </div>'
                                                                                                                                         +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                                                         
                                                                                                                                         //+' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                                                         +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                                                         +' <span class="shop-heart si">'
                                                                                                                                         +'<i class="fa fa-heart"></i>'
                                                                                                                                         +' </span>'
                                                                                                                                         +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                                                         +' <span class="shop-eye si">'
                                                                                                                                         +' <i class="fa fa-eye"></i>'
                                                                                                                                         +' </span>'
                                                                                                                                         +' </div>'
                                                                                                                                         +' </div>'
                                                                                                                                         +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                                                         +' <span class="cs1">Cashback</span>'
                                                                                                                                         +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                                                         +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                                                         +'   </div>'
                                                                                                                                         +'  </li>');
                                                                                                                       }
                                                                                                                       
                                                                                                                       
                                                                                                                       $('#merchantlist').append(mySecondDiv);
                                                                                                             
                                                                                                                       });
                                                                                                                }
                                                                                                                else{
                                                                                                                
                                                                                                                }
                                                                                                                },
                                                                                                                error      : function(e) {
                                                                                                                
                                                                                                                //console.error("error");
                                                                                                                 navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                                                                }
                                                                                                                });
                                                                                                         
                                                                                                         });
                                                                                   

                                                                                   $('#a-search').click(function(){
                                                                                                        $('#searchform').toggle('medium');
                                                                                                        })
                                                                                   
                                                                                   
                                                                                   });
                                                                  
                                                                  
                                                                
                                                                  
                                                                  function mylike(campaign_id){
                                                                  var userid =  localStorage.getItem("userid");
                                                                //  alert(userid);
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/like",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {ActivityIndicator.show()},
                                                                         complete   : function() {ActivityIndicator.hide()},
                                                                         data       : '{"user_id": '
                                                                         + userid + ',"campaign_id":'+campaign_id+' }',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.log( JSON.stringify(response));
                                                                                  merchantapi();                                                                   if(response.status=="Success"){
                                                                         
                                                                         
                                                                         }
                                                                         else{
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         //console.error("error");
                                                                         navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                         }
                                                                         });
                                                                
                                                                  }
                                                                  
                                                                  function unlike(campaign_id){
                                                                  var userid =  localStorage.getItem("userid");
                                                                //  alert(userid);
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/unlike",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {ActivityIndicator.show()},
                                                                         complete   : function() {ActivityIndicator.hide()},
                                                                         data       : '{"user_id": '
                                                                         + userid + ',"campaign_id":'+campaign_id+' }',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.log( JSON.stringify(response));
                                                                          merchantapi();
                                                                         if(response.status=="Success"){
                                                                         
                                                                         
                                                                         }
                                                                         else{
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         //console.error("error");
                                                                         navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                         }
                                                                         });
                                                                 
                                                                  }


                                                                  function merchantapi(){
                                                                  var mySecondDiv;
                                                                  var userid =  localStorage.getItem("userid");
                                                                  
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/merchants",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {},
                                                                         complete   : function() {},
                                                                         data       : '{"user_id": '
                                                                         + userid + '}',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.log( JSON.stringify(response));
                                                                         
                                                                         if(response.status=="Success"){
                                                                         
                                                                         $( "#walletamount1" ).empty();
                                                                         
                                                                         $('#walletamount1').text(response.walletAmount);
                                                                         $( "#merchantlist" ).empty();
                                                                         
                                                                          localStorage.setItem("wamount",  response.walletAmount);
                                                                         
                                                                         merchantResponse=response.merchants;
                                                                        
                                                                       
$.each(response.merchants, function(k, v) {if(v.fav==""){mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                         +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                         +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                         +' </div>'
                                                                         +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                         //+' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                         +' <div id="'+v.name+'" class="shop-icon">'
                                                                         +' <span class="shop-heart si">'
                                                                         +'<i class="fa fa-heart-o"></i>'
                                                                         +' </span>'
                                                                         +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                         +' <span class="shop-eye si">'
                                                                         +' <i class="fa fa-eye"></i>'
                                                                         +' </span>'
                                                                         +' </div>'
                                                                         +' </div>'
                                                                         +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                         +' <span class="cs1">Cashback</span>'
                                                                         +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                         +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                         +'   </div>'
                                                                         +'  </li>');
                                                                                }
                                                                                else{
                                                                                 mySecondDiv=$('<li id="'+v.name+'" class="lishop">'
                                                                                                  +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                                  +'<img class="img-responsive" src="'+v.store_logo+'">'
                                                                                                  +' </div>'
                                                                                                  +' <div class="col-xs-4 col-sm-5 shop-mdl"><h1>'+ v.name +'</h1>'
                                                                                                  
                                                                                                 // +' <p>'+ v.address +','+ v.postal_code +'</p>'
                                                                                                  +' <div id="'+v.name+'" class="shop-icon">'
                                                                                                  +' <span class="shop-heart si">'
                                                                                                  +'<i class="fa fa-heart"></i>'
                                                                                                  +' </span>'
                                                                                                  +'<span class="shop-point si">'+ v.likes +'</span>'
                                                                                                  +' <span class="shop-eye si">'
                                                                                                  +' <i class="fa fa-eye"></i>'
                                                                                                  +' </span>'
                                                                                                  +' </div>'
                                                                                                  +' </div>'
                                                                                                  +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                                  +' <span class="cs1">Cashback</span>'
                                                                                                  +'  <span class="csd">'+v.cashbackpercent  +'%</span>'
                                                                                                  +'  <span class="csp">Jackpot '+v.jackpot_amount  +'</span>'
                                                                                                  +'   </div>'
                                                                                                  +'  </li>');
                                                                                }
                                                                                
                                                                                
                                                                                
                                                                                $('#merchantlist').append(mySecondDiv);
                                                                                
                                                                                });
                                                                         }
                                                                         else{
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         //console.error("error");
                                                                         navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                         }
                                                                         });
                                                                  
                                                                  
                                                                  }
                                                                  
                                                                  
                                                                   $( document ).on( "pageshow","#shop-profile",function() {
                                                                                    
                                                                                    
                                                                                    $("#logouts").click(function () {
                                                                                                       localStorage.setItem("login", "");
                                                                                                       $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                       
                                                                                                       });

                                                                                    
                                                                                    var shopper=JSON.parse(localStorage.getItem("shopper"));
                                                                                  $('#likess').append(shopper.likes);
                                                                                   $('#detail h2').append(shopper.name);
                                                                                      $('#detail p:first').append(shopper.address);
                                                                                      $('#detail p:first').append(' '+shopper.postal_code);
                                                                                    $('#percantage').text(shopper.cashbackpercent+'%');
                                                                                     $('#jackpot_amount').text(shopper.jackpot_amount);
                                                                                    $('#wamount').text(localStorage.getItem("wamount"));
                                                                                      $('#merchant_phone').append(shopper.merchant_phone);
                                                                                       $('#detail p:nth-of-type(2)').append(shopper.merchant_phone);
                                                                                       $('#detail p:nth-of-type(3)').append(shopper.remarks);
                                                                                    
                                                                                    var photo = document.getElementById('profileimg');
                                                                                    photo.src = shopper.store_image;

                                                                                    var photo1 = document.getElementById('storelogo');
                                                                                    photo1.src = shopper.store_logo;
                                                                  });
                                                                  
                                                                  $(document).on("click", ".lishop", function (event) {
                                                                                 
                                                                                 var id=$(this).attr("id");
                                                                                 $.each(merchantResponse, function(k, v) {
                                                                                        if(id==v.name){
                                                                                        
                                                                                        //  alert(JSON.stringify(v));
                                                                                        localStorage.setItem("shopper",  JSON.stringify(v));
                                                                                       
                                                                                        }
                                                                                        });
                                                                                 
                                                                                 $.mobile.changePage( "shop-profile.html", { transition: "pop"} );
                                                                                 
                                                                                 });
                                                                  
                                                                  
                                                                  
                                                               

                                                                  
                                                                  $(document).on("click", ".shop-icon", function (e) {
                                                                                 e.stopPropagation();
                                                                                 // alert(JSON.stringify(merchantResponse));
                                                                                 var id=$(this).attr("id");
                                                                                 $.each(merchantResponse, function(k, v) {
                                                                                        if(id==v.name){
                                                                                        
                                                                                        if(v.fav=="1"){
                                                                                        unlike(v.campaign_id);
                                                                                        
                                                                                        }
                                                                                        else{
                                                                                        mylike(v.campaign_id);
                                                                                        
                                                                                        }
                                                                                        }
                                                                                        
                                                                                        });
                                                                                 });


                                                                  $( document ).on( "pageinit","#transactionlist",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   var walamount =  localStorage.getItem("wamount");
                                                                                   
                                                                                   $('#wlamount').append(walamount);
                                                                                   
                                                                                   transactionhistoryapi('all');
                                                                                   $("#radiodrop2").click(function(){
                                                                                                           $(".radio-drop").toggle("slide");                                                                                      })
                                                                                   
                                                                                   $("#transrecent").click(function () {
                                                                                                      transactionhistoryapi('recent');                                                                });
                                                                                   $("#transall").click(function () {
                                                                                                    transactionhistoryapi('all');
                                                                                                      });
                                                                                   $("#transweek").click(function () {
                                                                                                     transactionhistoryapi('oneweek');
                                                                                                      });
//
//                                                                                                           });
                                                                                   $("#logout2").click(function () {
                                                                                                      localStorage.setItem("login", "");
                                                                                                      $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                      
                                                                                                      });
                                                                                   
                                                                                   
                                                                                   
                                                                                   });
                                                                  
                                                                  function transactionhistoryapi(sortby){
                                                                  // $(".radio-drop").slideDown("fast");
                                                                  var userid =  localStorage.getItem("userid");
                                                                  
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/transactionhistory",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {ActivityIndicator.show()},
                                                                         complete   : function() {ActivityIndicator.hide()},
                                                                         data       : '{"user_id": '
                                                                         + userid + ',"sort_by":"'+sortby+'"}',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.log( JSON.stringify(response));
                                                                         
                                                                         if(response.status=="Success"){
                                                                         $( "#translist" ).empty();
                                                                         $.each(response.shoppers, function(k, v) {
                                                                               
                                                                                myDiv=$('<li>'
                                                                                        +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                        +' <img class="img-responsive" src="'
                                                                                        +v.merhcant_logo+'">'
                                                                                        +'</div>'
                                                                                        +'<div class="col-xs-4 col-sm-5 shop-mdl">'
                                                                                        +'<h1>'+v.store_name+'</h1>'
                                                                                        +'<p>'+v.date_time+'</p>'
                                                                                        +'</div>'
                                                                                        +'<div class="col-xs-4 col-sm-4 shop-rgt">'
                                                                                        +' <span class="csd1">'+v.total_amount+'</span>'
                                                                                        +' </div>'
                                                                                        +'  </li>');
                                                                                $('#translist').append(myDiv);
                                                                                
                                                                                });
                                                                         
                                                                         }
                                                                         else{
                                                                         navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         console.error( JSON.stringify(e));
                                                                         navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                         }
                                                                         });
                                                                  
                                                                  }


                                                                  
                                                                  $( document ).on( "pageinit","#cashbacklist",function() {
                                                                                   FastClick.attach(document.body);
                                                                                   var walamount =  localStorage.getItem("wamount");
                                                                                   
                                                                                   $('#welamount').append(walamount);
                                                                                   
                                                                                   cashbackhistoryapi('pending');
                                                                                   $("#radiodrop3").click(function(){
                                                                                                           $(".radio-drop").toggle("slide");                                                                                      })
                                                                                   
                                                                                   $("#cashpending").click(function () {
                                                                                                           cashbackhistoryapi('pending'); 
																										   });
                                                                                   $("#cashdeclined").click(function () {
                                                                                                        cashbackhistoryapi('declined');
                                                                                                        });
                                                                                   $("#cashconfirmed").click(function () {
                                                                                                         cashbackhistoryapi('confirmed');
                                                                                                         });
                                                                                   //
                                                                                   //                                                                                                           });
                                                                                   $("#logout3").click(function () {
                                                                                                       localStorage.setItem("login", "");
                                                                                                       $.mobile.changePage( "index.html", { transition: "pop"} );
                                                                                                       
                                                                                                       });
                                                                                   
                                                                                   
                                                                                   
                                                                                   });
                                                                  
                                                                  function cashbackhistoryapi(sortby){
                                                                 // $(".radio-drop").slideDown("fast");
                                                                  var userid =  localStorage.getItem("userid");
                                                                  
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/cashbackhistory",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {ActivityIndicator.show()},
                                                                         complete   : function() {ActivityIndicator.hide()},
                                                                         data       : '{"user_id": '
                                                                         + userid + ',"sort_by":"'+sortby+'"}',
                                                                         dataType   : 'json',
                                                                         success    : function(response) {
                                                                         console.log( JSON.stringify(response));
                                                                         
                                                                         if(response.status=="Success"){
                                                                         $( "#cashlist1" ).empty();
                                                                         $.each(response.shoppers, function(k, v) {
                                                                                
                                                                                myDiv=$('<li>'
                                                                                        +' <div class="col-xs-4 col-sm-3 shop-lft">'
                                                                                        +' <img class="img-responsive" src="'
                                                                                        +v.merhcant_logo+'">'
                                                                                        +'</div>'
                                                                                        +'<div class="col-xs-4 col-sm-5 shop-mdl">'
                                                                                        +'<h1>'+v.store_name+'</h1>'
                                                                                        +'<p>'+v.date_time+'</p>'
                                                                                        +'</div>'
                                                                                        +'<div class="col-xs-4 col-sm-4 shop-rgt1">'
                                                                                        +' <span class="csd">'+v.earn_amount+'</span>'
                                                                                        +' </div>'
                                                                                        +'  </li>');
                                                                                $('#cashlist1').append(myDiv);
                                                                                
                                                                                });
                                                                         
                                                                         }
                                                                         else{
                                                                         navigator.notification.alert(response.msg, alertDismissed, 'Error', 'OK');
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         console.error( JSON.stringify(e));
                                                                        navigator.notification.alert('Network Error. Please try Again', alertDismissed, 'Error', 'OK');
                                                                         }
                                                                         });
                                                                  
                                                                  }
                                                                  

                                                                  function alertDismissed() {
                                                                  // do something
                                                                  }
  
                                                                  function pushregister(){
                                                                  


                                                                  var userid =  localStorage.getItem("userid");
                                                                  var tokeen =  localStorage.getItem("tokeen");
                                                                 if(tokeen!=""){
                                                                  $.ajax({
                                                                         type       : "POST",
                                                                         url        : "http://www.kickback.sg/alphadevelop/shopper/mobile_app/savetoken",
                                                                         contentType: "application/json ",
                                                                         beforeSend : function() {},
                                                                         complete   : function() {},
                                                                         data       : '{"user_id": "'+ userid+'","token":"'+tokeen+'","device":"android"}',


                                                                         dataType   : 'json',
                                                                         success    : function(response) {

                                                                         console.log('gff'+response);

                                                                         if(response.status=="Success"){
                                                                         
                                                                         }
                                                                         else{
                                                                         
                                                                         }
                                                                         },
                                                                         error      : function(e) {
                                                                         
                                                                         console.error(e);
                                                                         // alert("Network Error.Try Again");
                                                                         
                                                                         }
                                                                         });
                                                                  }
                                                                  }
                                                                  

