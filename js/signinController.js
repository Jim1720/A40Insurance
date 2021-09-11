
app.controller('signinController', ['$http', '$scope', 'customerService', '$location' , 'appService',
                'claimService', 'tokenService',
				 function($http, $scope, customerService, $location, appService, claimService,
					      tokenService) {
 
	// scope must be first parm
	// http is build in dont list it. 

	$scope.custId = "";
	$scope.custPass = ""; 
	
	$scope.message = "Enter Customer ID and Password to Sign In.";  
	$scope.password = "";
	
 
	$scope.signin = function () {   
 

		if(this.editor() == false)
		{ 
			return;
		}
 
 
		if(this.findCustomer() == false)
		{ 
			return; // show message 
		} 
 
	}  
 
		

	$scope.start = function () { 
		 
		$scope.$parent.start(); 

	} 

 $scope.editor = function () {  

		if($scope.custId == "") {
			$scope.message = "Enter Customer ID.";
			return false;
		}

		if($scope.custPass == "") {
			$scope.message = "Enter Customer Password.";
			return false;
		}

		var pattern = new RegExp("^[A-Za-z0-9]+$");  

		var res = pattern.exec($scope.custId);

		if(pattern.test($scope.custId) == false) {
			$scope.message = "Customer ID must be all letters or numbers.";
			return false;
		} 
		
		if(pattern.test($scope.custPass) == false) {
			$scope.message = "Password must be all letters or numbers.";
			return false;
		}

		return true;  
	}
 

	$scope.findCustomer = function() {   
 
 
		    debugger;
			var url = appService.getAPIUrl();
			//
			// call signin with user id and password:  get (id,pw)
			//
			$http.get(url + 'signin?id=' + $scope.custId + '&pw=' + $scope.custPass)
			.then(function(data,status,headers,config) { 
				// parse string into json 
				var result = data.data;

		//		console.log('result:' + result);
				 
				

				// did we find a customer?
				if( result['Status'] === 'Unsuccessful') {
					// not found
					$scope.message = result['Message'];
					return; 
				} 

				debugger;
				var foundCust = {}; 
				foundCust = result['Customer'];

				// check password 
				if ($scope.custPass !== foundCust.custPassword.trim() ) { 
					$scope.message = "Invalid Password";
					return; 
				}  

				customerService.storeCustomer(foundCust);  
				debugger;
				// for link display
				$scope.$parent.$parent.userSignedIn = true;
				let first = foundCust.custFirst.trim();
				let last  = foundCust.custLast.trim();  
				$scope.$parent.$parent.customerFirst = first;
				$scope.$parent.$parent.customerLast = last; 
				$scope.$parent.$parent.asterisk = ' * ';
				$scope.$parent.navMessage = first + " " + last;

				appService.setAdminLoggedOut();
				// protect url from bypass login process
				// for url protection ladded later in dev phase.
				appService.setCustomerLoggedIn();
				
				var msg = "Signed in successfully.";
				claimService.setPendingMessage(msg);

				var token = result['Token'];
				tokenService.setToken(token); 
				
				// all good - continue to update screen.
				$location.path('/hub');
						 
			},  
		    function(data,status,headers,config) {

				debugger;
				
				try {

						if(data.status == -1) {
							
							$scope.message = "Server is down contact administrators.";

						} else {

							$scope.message = "Not found or issue: " + status; 
							console.log("status=" + status);
							console.log("data.data=" + data.data);
						}
						
		     	}
				catch(e) {

					$scope.message = "Server is down contact administrators.";
				} 
			}); 
		  
 
	} // end find customer 


}]);
