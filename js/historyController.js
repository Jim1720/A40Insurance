
app.controller('historyController', [ '$http','$scope', '$location' , '$route', 'customerService',  
    'claimService', 'appService', 'historyService', 'tokenService', 

	function($http, $scope, $location, $route, customerService, claimService, appService,
             historyService, tokenService) { 
 
    // $route needed for $route.reload after focus=on;pay claim to refresh screen.
      
    $scope.claims = {};
	$scope.claimCount = 0;  
    var control = this; 

    // for focused claim
    $scope.focusedClaimId = "";
    $scope.focusdClaimIsSet = false;
    $scope.act1ClaimId = "";
    $scope.act2ClaimId = "";

    // immediate update selected paid claim line before screen refresh.
    $scope.payStay = { claimIdNumber: '', paymentAmount: 0, PaymentDate: ''};

    // these may not be used ...
    $scope.payLine1 = ` 

        <div id='payLine1' class='row'>
        <div class='col-md-3 white f'>Payment Amount:</div>
        <div class='col-md-3 white f'>Date:</div> 
        </div>`;

    $scope.payLine2 = ` 

        <div id="payLine2">
            <div class="col-md-3 burleywood f">$2</div> 
            <div class="col-md-3 dodgerblue f">{{claim.PaymentDate}}</div>  
        </div> `;

    // insure pay focus has new data before refresh of route data ... 

    // for getAction() ... 
    actionObjectReturned = { actionLit: '', claimId: '' }; 

    control.$postLink = function() {

        /*
            https://docs.angularjs.org/guide/component
        */ 
       
        // similar to ngAfterViewInint in later versions of angular.
        $scope.provideScrolling();

    }

    $scope.provideScrolling = function () {

        debugger; 
                
        var stay = $scope.usingStay && $scope.isStayOn;
        var focus = $scope.usingFocus && $scope.isFocusOn;

        var stayFocusSettingsAreUsed = stay && focus;
        var onlyStayIsUsedWithoutFocus = stay && !focus;

        if(stayFocusSettingsAreUsed) {

            setTimeout(function() { 

                var focusElement = document.getElementById('focus'); 
                
                if(focusElement !== null) {   
        
                    $(window).scrollTop($("#focus").offset().top);    

                }
            }, 1000);  

        }

        if(onlyStayIsUsedWithoutFocus) {

                setTimeout(function() { 

                    var focusElement = document.getElementById('top'); 
                    
                    if(focusElement !== null) {   
            
                        $(window).scrollTop($("#top").offset().top);    

                    }
                }, 1000);  
        } 
    

    }
	
	control.$onInit = function() {  
         

       // verify proper customer login
        if(appService.isCustomerLoggedIn() == false) {
            $location.path('/start');
        }

        // environment settings - show buttons or not..
        $scope.usingStay = appService.usingStay();
        $scope.usingFocus = appService.usingFocus();
        $scope.usingNav = appService.usingNav();
        $scope.usingActions = appService.usingActions();
        $scope.stayLiteral = "";
        $scope.focusLiteral = "";
        
        // initial stay and focus button settings
        $scope.isStayOn = historyService.isStayOn();
        if($scope.usingStay) {
            $scope.stayLiteral = $scope.isStayOn ? "stay on" : "stay off";
        } 
         
        // set button
        $scope.isFocusOn = historyService.isFocusOn(); 
        if($scope.usingFocus) {
            $scope.focusLiteral = $scope.isFocusOn ? "focus on" : "focus off";
        } 
 
        // activate focus 
        $scope.focusedClaimId = "";
        var claimIsInFocus = historyService.isFocusedClaimSet();  
        if(claimIsInFocus) { 

            $scope.focusedClaimId = historyService.getFocusedClaimId();
            //console.log("hcontrol - $scope.focusedClaimId: ." + $scope.focusedClaimId + ".");  
            $scope.focusdClaimIsSet = true;
            historyService.setFocusedClaimId(""); 

        } /* end focused claim setup processing */

        // action button settings  
        
        $scope.action1Lit = "";
        $scope.action2Lit = "";
        $scope.action1ClaimId = "";
        $scope.action2ClaimId = ""; 
        $scope.action1ButtonUsed = false;
        $scope.action2ButtonUsed = false;
       
        debugger; 

        var getActionObject = { index: 0, actionLit: '' , claimId: '', data: false } 

        var act1 =  historyService.getAction(getActionObject);
        if(act1.found === true)
        {
            $scope.action1Lit = act1.actionLit;
            $scope.action1ClaimId = act1.claimId;
            $scope.action1ButtonUsed = true;
        }

        getActionObject.index = 1;
        var act2 = historyService.getAction(getActionObject);
        if(act2.found === true)
        { 
            $scope.action2Lit = act2.actionLit;
            $scope.action2ClaimId = act2.claimId;
            $scope.action2ButtonUsed = true; 
        } 
 

        // read claim history  
        $scope.getClaimHistory();
 
    }  
 
 
     
  
    $scope.navTop = function () {

        
        $(window).scrollTop($("#top").offset().top);

    }

    $scope.navMid = function () {

        
        $(window).scrollTop($("#mid").offset().top);

    }

    $scope.navBot = function () {

        
        $(window).scrollTop($("#bot").offset().top);

    }

    $scope.navAct1 = function () {

        
        $(window).scrollTop($("#act1").offset().top);

    }

    $scope.navAct2 = function () {

        
        $(window).scrollTop($("#act2").offset().top);

    }


    $scope.toggleStay = function() {

        $scope.stayLiteral = historyService.toggleStay();
    }

    $scope.toggleFocus = function() {

        $scope.focusLiteral = historyService.toggleFocus();
    }

    $scope.adjustClaim = function(index)
    {
        //TODO: fix other buttons wrong syntax 
        var claim = $scope.claims[index];
        claimService.setClaim(claim); 
        var msg = "Enter adjustment for claim: " +
                   claim.claimIdNumber;
        claimService.setPendingMessage(msg);
		$location.path('/claim');
    } 


    $scope.makeClaimPayment = function(index) {

        // rewrite bypass claim service 

        var claim = $scope.claims[index];
        var claimId = claim.ClaimIdNumber.trim(); 

        // moved here to set pay stay fields was in procesClaim.
        var paymentAmount = $scope.promptUserForAmount();
        if(paymentAmount === null) {

            return null;; // bad amount return to history
        }


        var today = this.getCurrentDate();
 
        var defaultPlan = "";
        var serverAction = "pay";

        // set up parameters
        var claimStatusObject = {claimIdNumber: claimId, 
                                 action: serverAction,
                                 date: today, 
                                 amount: paymentAmount, 
                                 plan: defaultPlan};
        debugger;
        // add token 
        claimStatusObject['_csrf'] = tokenService.getToken(); 

        $scope.makePaymentUpdateRequest(claimStatusObject);

    }
 

        
     $scope.makePaymentUpdateRequest = function(claimStatusObject)  {

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
               claimService.setPendingMessage(message);  

               $scope.postPaymentUpdateProcessing(a);
   
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

    $scope.postPaymentUpdateProcessing = function(claimId) {

         // set focused claim    
         if(appService.usingFocus() && historyService.isFocusOn()) {  

            historyService.setFocusedClaimId(claimId);
        } 
       
        // set action for history if used
        var usingActions = appService.usingActions();
        if(usingActions) { 
 
            setActionObject = { action: 'Payment', claimId: claimId }; 
            historyService.setAction(setActionObject); 
        } 

        $scope.setPaymentLine();

        // if stay button on and using stay go back to history.  
        if(appService.usingStay() && historyService.isStayOn())
        { 
            return; // stay on history
        }  

        $location.path('/hub'); 
        return;


    }

   
    $scope.setPaymentLine = function(claimId, paymentAmount, paymentDate)
    {
        // immediately always reflect results on claim screen
        // possibly before async function to read claims runs.
        $scope.payStay.claimIdNumber = claimId;
        $scope.payStay.paymentAmount = paymentAmount;
        $scope.payStay.PaymentDate = paymentDate;
        $route.reload();
    }

    $scope.promptUserForAmount = function() {

        var userAmount = prompt("Please enter amount of payment...");
        var amt = parseFloat(userAmount);
        if(isNaN(amt)) {
            console.log("please enter proper dollar amount...0");
            return null;
        }  
        return amt;
    }

    $scope.screenDate = function(value) {
 
        // changes yyyy/mm/dd to mm/dd/yyyy show yyyy for dob 
        var year = value.substring(0,4);
        var day = value.substring(8,10);
        var month = value.substring(5,7);
        //var result = `${month}/${day}/${year}`
        // ie 11
        var result = month + '/' + day + '/' + year;
        return result; 
    } 
	  
    $scope.getClaimHistory = async function() {  

		debugger;

        var customer = customerService.getCustomer(); 
        var custId = customer.custId;  
        try {
 
            var url = appService.getAPIUrl();
            $http.get(url + 'history?id=' + custId)  
            .then(function(data,status,headers,config) {
  
                var claims = [];
                claims = data.data; 
                // do any formatting 
                //ie 11 fix: can not use for let.
                  

                for(c = 0; c < claims.length; c++) { // claim object  
 
                    var claim = claims[c]; 

                    // set focused attribute on claim
                    var cid = claim.ClaimIdNumber.trim(); 
 

                    //
                    if(cid === $scope.focusedClaimId)
                    { 
                        claim.claimIsFocused = true; 
                    }
                    else
                    {
                        claim.claimIsFocused = false;
                    } 

                    if(cid === $scope.action1ClaimId)
                    { 
                        claim.claimIsAct1 = true;
                    }
                    else
                    {
                        claim.claimIsAct1 = false;
                    }
                     
                    if(cid === $scope.action2ClaimId)
                    { 
                        claim.claimIsAct2 = true;
                    }
                    else
                    {
                        claim.claimIsAct2 = false;
                    }
                    
            
                    // trip service date to 10 left positions.
                    claim.DateService = claim.DateService.substring(0,10); 
                    if(claim.AdjustedDate === null ) {
                        claim.AdjustedDate = '';
                    } else {
                        claim.AdjustedDate = claim.AdjustedDate.substring(0,10);
                        claim.AdjustedDate = $scope.screenDate(claim.AdjustedDate);
                    }

                    // only filled in on paid claims
                    if(claim.ClaimStatus.trim() === "Paid") { 
                        claim.PaymentDate = claim.PaymentDate.substring(0,10); 
                        claim.PaymentDate = $scope.screenDate(claim.PaymentDate); 
                    }

                    var a = claim.DateConfine;
                    var b = claim.DateRelease; 
                    // ie 11 console.log(`ch: conf(${a}) rel(${b}  `);

                    claim.DateService = $scope.screenDate(claim.DateService);

                    var yConfine = claim.DateConfine.toString().substring(0,4);
                    var yRelease = claim.DateRelease.toString().substring(0,4);
                    //
                    claim.DateConfine=(yConfine === null || yConfine==="1900" || yConfine==="1753") ? '' : $scope.screenDate(claim.DateConfine.substring(0,10));
                    claim.DateRelease=(yRelease === null || yRelease==="1900" || yRelease==="1753") ? '' : $scope.screenDate(claim.DateRelease.substring(0,10));
                        
                    a = claim.DateConfine;
                    b = claim.DateRelease;  
 
                    switch(claim.ClaimType) {

                        case 'm': claim.ClaimType = "Medical"; break;
                        case 'd': claim.ClaimType = "Dental"; break;
                        case 'v': claim.ClaimType = "Vision"; break;
                        case 'x': claim.ClaimType = "Drug"; break;
                        default : claim.ClaimType = "Unknown";

                        }  
                }


				$scope.claims = claims;

                // for navigation buttons  
                $scope.totalCount = $scope.claims.length;
                $scope.halfCount = ($scope.totalCount - ($scope.totalCount % 2)) / 2;
				
				var msg = '';
				switch($scope.claims.length) {
					case 0: msg = 'no claims found'; break;
					case 1: msg = '1 claim found'; break;
					default: msg = $scope.claims.length + ' claims found'; break; 
				};
				$scope.message = msg;    
              
                return "";
                        
            },  
            function(data,status,headers,config) {

                debugger;
                console.log('hist call fails status:' + status); 
                return "";
            });  

        }
        catch(err)
        {
            debugger;
            console.log("error encountered in history read:" + err.message);
            return "error";
            
        } 

        return ""; 

	}
 
}]);
