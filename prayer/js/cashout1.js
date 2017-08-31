$( document ).on( "pageinit","#cashout1",function() {
                 FastClick.attach(document.body);
                 
                 alert('cashout');
                 
                 var userid =  localStorage.getItem("userid");
                 
                 $.ajax({
                        type       : "POST",
                        url        : "http://www.kickback.sg/shopper/mobile_app/cashoutcondition",
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
                        
                        }
                        },
                        error      : function(e) {
                        
                        //console.error("error");
                        alert(JSON.stringify(e));
                        }
                        });
                 });
function alertDismissed() {
    // do something
}

