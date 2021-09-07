
app.controller('historyController', [ '$http','$scope', '$location', 'customerService',  
    'claimService', 'appService',

	function($http, $scope, $location, customerService, claimService, appService) { 
 
    console.log('history controller');
    $scope.message = "claim history controller";

    $scope.claims = {};
	$scope.claimCount = 0;  
    var control = this; 
	
	control.$onInit = function() {
 
        
       // verify proper customer login
        if(appService.isCustomerLoggedIn() == false) {
            $location.path('/start');
        }

		$scope.getClaimHistory();  
		
    } 

    $scope.adjustClaim = function(index)
    {
        //TODO: fix other buttons wrong syntax
        debugger; 
        var claim = $scope.claims[index];
        claimService.setClaim(claim); 
        var msg = "Enter adjustment for claim: " +
                   claim.claimIdNumber;
        claimService.setPendingMessage(msg);
		$location.path('/claim');
    } 


    $scope.payClaim = function(index) {

        var action = "PayClaimWithUserInput";
        var claim = $scope.claims[index];
        var claimId = claim.ClaimIdNumber;
        var result = claimService.processClaim(action, claimId);
        if(result === null) {
            return; // bad result do nothing message was issued to user
        }
        // good result go to update
        var message = result; // service sends back a message if good null if not.
        this.app.setPendingMessage(message);
        $location.path('/hub');

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
	  
    $scope.getClaimHistory = function() {

		console.log('getClaimHistory - ');

		debugger;
        var customer = customerService.getCustomer(); 
        var custId = customer.custId;  
        try {

            debugger;
            var url = appService.getAPIUrl();
            $http.get(url + 'history?id=' + custId)  
            .then(function(data,status,headers,config) {

                debugger;  
                var claims = [];
                claims = data.data; 
                // do any formatting
                debugger; 
                //ie 11 fix: can not use for let.
                
                // the let may break ie11. do not use for.let.
                var defaultDate = "01/01/1900";

                for(c = 0; c < claims.length; c++) { // claim object 

                            debugger;
                            var claim = claims[c]; 
                    
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
                            //claim.DateConfine = claim.DateConfine.substring(0,10).trim();
                            //claim.DateRelease = claim.DateRelease.substring(0,10).trim();

                            // html will not show defualt dates.  
                            /*if(claim.DateConfine === defaultDate) {  
                                claim.DateConfine = "n/a";
                            } else {
                                claim.DateConfine = $scope.screenDate(claim.DateConfine);
                            }
                            if(claim.DateRelease === defaultDate) {  
                                claim.DateRelease = "n/a";
                            } else {
                                claim.DateRelease = $scope.screenDate(claim.DateRelease);
                            }*/
                          
                            

                            a = claim.DateConfine;
                            b = claim.DateRelease;  

                            debugger;
                            switch(claim.ClaimType) {

                                case 'm': claim.ClaimType = "Medical"; break;
                                case 'd': claim.ClaimType = "Dental"; break;
                                case 'v': claim.ClaimType = "Vision"; break;
                                case 'x': claim.ClaimType = "Drug"; break;
                                default : claim.ClaimType = "Unknown";

                             }  
                }


				$scope.claims = claims;
				
				var msg = '';
				switch($scope.claims.length) {
					case 0: msg = 'no claims found'; break;
					case 1: msg = '1 claim found'; break;
					default: msg = $scope.claims.length + ' claims found'; break; 
				};
				$scope.message = msg;
                        
            },  
            function(data,status,headers,config) {

                debugger;
                console.log('hist call fails status:' + status); 
                return null;
            });  

        }
        catch(err)
        {
            debugger;
            console.log("error encountered in history read:" + err.message);
            return null;
            
        } 


	}
 
}]);
