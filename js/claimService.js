
// claimService.js

app.service('claimService', [ '$http', '$location', 'appService', 'tokenService',  
             function($http, $location, appService, tokenService) {
 

                // depricated .... logic moved to historyControllor to try to solve
                // mysterious timing issue of screen not  geting updated.


    // updates claim by paying, voiding etc.
    // called from history screen
    // when completed a message is sent to update screen or main menu
    // showing completed or failed.

    // 1. get the claim
    // 2. do action
    // 3. update claim (need to code in a45.)

    message = ""; // forward messages to update/menu.
    currentClaim = {}; // hold claim to adjust.
    

    this.processClaim = function(action, claimIdNumber, paymentAmount, today)  {

    switch(action) {

        case  'PayClaimWithUserInput':
             
             var defaultPlan = "";
             var serverAction = "pay";

             // set up parameters
             var claimStatusObject = {claimIdNumber: claimIdNumber, 
                                      action: serverAction,
                                      date: today, 
                                      amount: paymentAmount, 
                                      plan: defaultPlan};
             debugger;
             // add token 
             claimStatusObject['_csrf'] = tokenService.getToken();

             // make claim payment call
             var setStatusResult = this.makePaymentStatusUpdate(claimStatusObject);
             if(setStatusResult === null) {
                 var message = "pay claim db update unsuccessful";
                 this.setPendingMessage(message);
                 return message;
             } else {
             
                 return "OK"; 
             }

             
            break; 
        default:
            break;
        }

        return null; // invalid coded path!
    }

    // this.getCurrentDate = () => { // ie 11
    this.getCurrentDate = function() {

        var d = new Date();
        var today = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();  
        return today;
    }

    

    this.makePaymentStatusUpdate = function(claimStatusObject)  {

        var closureThis = this;

        try {

            debugger;
   
            var url = appService.getAPIUrl();
            $http.put(url + 'setClaimStatus/',claimStatusObject)
            .then(function(data,status,headers,config) {
   
               // print success message and transfer 
                
              // send message for user display in update screen.
               var a = claimStatusObject.claimIdNumber.toString();
               var b = claimStatusObject.amount.toString();
               // ie 11 var message = `Claim ${a} paid with $${b}.`;
               var message = "Claim " + a + " paid with $" + b + ".";
               closureThis.setPendingMessage(message);  
   
         }, 
         function(data,status,headers,config) {
   
               console.log("pay fails");
               console.log("payment action fails: status is: " + status.toString());
               var failMessage = "Payment action fails." + status.toString();
               closureThis.setPendingMessage(failMessage);
               $location.path('hub');
         });
   
   }
   catch(err)
   {
     
       console.log("error encountered claim payment process:" + err.message);
       var failMessage = "Payment action fails. - " + err.message;
       this.setPendingMessage(failMessage);
       $location.path('update');
   
   }




    }

    this.getPendingMessage = function() {

        // update reads this : send void or payment messages 
        // back to main menu.
        var m = this.message;
        this.message = '';
    //    console.log(' claim service - getPendingMessage is:' + this.message);
        return m;

    }
    this.setPendingMessage = function(value) {
        this.message = value;
     //   console.log('claim service - setPendingMessage to :' + this.message);
    }

    this.setClaim = function(claim) {
        // transmit number to adjustment screen.
        this.currentClaim = claim;
    }

    this.getClaim = function() {
        return this.currentClaim;
    }

  
 

}]);
