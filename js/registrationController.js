

app.controller('registrationController', [ '$http','$scope', 'customerService',  
//   'dateEditService', 
   'dateService',
   '$location' ,
   'appService',
   'tokenService',
   'claimService', 
   function($http, $scope, customerService,
		  //	dateEditService,
			dateService,
			$location,
			appService,
			tokenService,
			claimService)
 { 
						 			    

	var control = this; 
	message = "";
	$scope.message = "";
	
	control.$onInit = function() {
 
		$scope.custGender = "M";
		$scope.custState = "WA"; 
		
	}

	  
	$scope.inputBirthDate = ''; // save screen data for update when ok.
  

	$scope.remove = function(field) {

		return (field === undefined) ? '' : field;
	}

	$scope.registerCustomer = function () { 
   
		debugger;
		// remove any undefineds 
		$scope.custId = $scope.remove($scope.custId); 
		$scope.custPass = $scope.remove($scope.custPass);
		$scope.custFirst = $scope.remove($scope.custFirst); 
		$scope.custLast = $scope.remove($scope.custLast);
		$scope.custEmail = $scope.remove($scope.custEmail); 
		$scope.custPhone = $scope.remove($scope.custPhone);
		$scope.custAddr1 = $scope.remove($scope.custAddr1); 
		$scope.custAddr2 = $scope.remove($scope.custAddr2);
		$scope.custCity = $scope.remove($scope.custCity);
		$scope.custState = $scope.remove($scope.custState); 
		$scope.custZip = $scope.remove($scope.custZip); 
		$scope.custGender = $scope.remove($scope.custGender);
		$scope.custMiddle = $scope.remove($scope.custMiddle);
		$scope.custBirthDate = $scope.remove($scope.custBirthDate);
 
		debugger;
		$scope.cust = {};   
		$scope.cust.custId = $scope.custId;
		$scope.cust.custPass = $scope.custPass;
		$scope.cust.custFirst = $scope.custFirst;
		$scope.cust.custLast = $scope.custLast;
		$scope.cust.custEmail = $scope.custEmail;
		$scope.cust.custPhone = $scope.custPhone;
		$scope.cust.custAddr1 = $scope.custAddr1;
		$scope.cust.custAddr2 = $scope.custAddr2;
		$scope.cust.custCity = $scope.custCity;
		$scope.cust.custState = $scope.custState;
		$scope.cust.custZip = $scope.custZip; 
		$scope.cust.custGender = $scope.custGender;
		$scope.cust.custMiddle = $scope.custMiddle;
		$scope.cust.custBirthDate = $scope.custBirthDate;
		$scope.cust.appId = "A40";
		$scope.cust.extendColors = "0"; // 2.24.2020
		$scope.cust.claimCount = 0;
		$scope.cust.custPlan = "";
		$scope.cust.PromotionCode = $scope.promo; // used for authentication
		$scope.cust.Encrypted = "";
		
		
		// add XSRF-TOKEN
		$scope.cust._csrf = tokenService.getToken(); 
		
		$scope.messages = [];  

	
		
 
	
		if($scope.editFields() === false) { 
			
			return;
			
		}  
         
        debugger;

		// point of no return ! code never comes back

		this.findCustomer();

		// do not put any code here it is never executed.
	} 

  
	$scope.findCustomer = function() {   

		// either puts dup message out or calls the add function that
		// must be called here due to async nature of code. 
 
		debugger;

		var url = appService.getAPIUrl();
		var id = $scope.custId;
		var suffix = 'cust?id=' + id;
		var pass = url + suffix; 

		try {
		
		$http.get(pass)
		.then(function(data, status, headers, config) {
 
			// note to developer - this function never comes back
			// do all message setting here !

			debugger;
			var a45object = data.data;
			if(a45object.Status === 'Successful') {
			   //$scope.messages[0] = "Customer Id alredy in use - pick another one.";
			   $scope.message = "Customer already exists.";
			   return;
			}
			 
			// if we get here no duplicate proceed with add. 
	    	$scope.addCustomer(); // never comes back!  
			return; 
	 
		},
		function(data, status, headers, config) {

			console.log("find customer error conditon");
			$scope.message[0] = "Error :" + status;

		});

	} catch(err) {

		  $scope.messages[0] = "Critical error on lookup";
		  console.log(err.message);
	}

	 
		//console.log("find customer out of bounds in code.");
		//debugger;


} // end find customer


	$scope.addCustomer = function () {

		// Add Customer : change to json and POST.  do we need $q ?

	//	console.log('adding customer');

		// TODO: add duplicate check will add dups since key is auto generated.

	

		try {

			debugger;
			var closureThis = this;
			var url = appService.getAPIUrl();
			$http.post(url + 'register/',$scope.cust)
			.then(function(data,status,headers,config) {

				  // register - checks promo and email for authentication 
				  // check reseults.
				  debugger;
				  var result = data['data'];
				  if( result['Status'] === "Unsuccessful") {

					$scope.pass = false;
					var msg = result['Message'];
					closureThis.message = msg;
					$scope.message = "Unsuccessful Add";
					return;

				  }

				  // print success message and transfer 
				  $scope.$parent.message = "Registration Success";  
				  customerService.storeCustomer($scope.cust);   
				  // see signin... 
				  debugger;
				  
				  // for links.
				  $scope.$parent.$parent.userSignedIn = true;
				  let first = $scope.cust.custFirst;
				  let last  = $scope.cust.custLast;
				  $scope.$parent.$parent.customerFirst = first;
				  $scope.$parent.$parent.customerLast = last; 
				  $scope.$parent.$parent.asterisk = ' * ';
				  $scope.$parent.navMessage = first + " " + last;

				  // URL control prevent url access...
				  appService.setAdminLoggedOut(); 
				  appService.setCustomerLoggedIn();

				  // set token 
				  var token = result['Token'];
				  tokenService.setToken(token);

				  var msg = "Registered. Update plan information.";
			      claimService.setPendingMessage(msg);

				  $location.path('plan');

			}, 
			function(data,status,headers,config) {

				$scope.pass = false;
				$scope.message = "(2) Customer Add issue! it did not work. " +  status;
			});

		}
		 catch(err)
		 {
				 
			console.log("(3) error encountered in add:" + err.message);
			
		 }

	   // This code runs ok and sets message ; have to set $scope using this means.
	   if(this.message !== '') {
    
        $scope.message = this.message;
		return;

	   }
    }
  

 

	$scope.editFields = function() {  // ie 11 no lambda functions.

	//	console.log('1a custId ' + $scope.custId);
	//	console.log('2a custId  ' + $scope.cust.custId);

		var msg = []; 
		var concat = ''; 
	
		var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
		var name2 = "^[a-zA-Z0-9.#\s]+"; // city names 
		var addr2 = "^[a-zA-Z0-9.#\s]* || \\s"; // addr 2 is not req allow space. * o,more
		var phone = "^[0-9]{10}|([0-9]{3})[0-9]{3}-[0-9]{4}$";
		var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$";
		var date1 = "^[0-9\/]+$"; // dob   
		var mid1 = "^[a-zA-z]*$";  // * optional 
	
		var pat1 = new RegExp(name1);
		var pat2 = new RegExp(name2); 
		var pat2a = new RegExp(addr2);
		var pPhone = new RegExp(phone);
		var pEmail = new RegExp(email);
		var pDate = new RegExp(date1); 
		
		var pMid1 = new RegExp(mid1);

	
		if(!pat1.test($scope.custId.trim())) { 
			msg.push('invalid customer id ' + $scope.custId.trim()); 
		}
	
		if(!pat1.test($scope.custPass.trim())) { 
			msg.push('invalid password ' + $scope.custPass.trim()); 
		}

		if($scope.custConfirm !== $scope.custPass) { 
			msg.push("Confirmation password does not match password."); 
		}
	
		if(!pat2.test($scope.custFirst.trim())) { 
			msg.push('invalid  first name '); 
		}
	
		if(!pat2.test($scope.custLast.trim())) { 
			msg.push('invalid  last name'); 
		}
	
		if(!pEmail.test($scope.custEmail.trim())) { 
			msg.push('invalid  email'); 
		}
	
		if(!pPhone.test($scope.custPhone.trim())) { 
			msg.push('invalid  phone'); 
		}
	
		if(!pat2.test($scope.custAddr1.trim())) { 
			msg.push('invalid address 1'); 
		}
	
		if(!pat2a.test($scope.custAddr2.trim())) { 
			msg.push('invalid  address 2'); 
		}
	
		if(!pat2.test($scope.custCity.trim())) { 
			msg.push('invalid  city'); 
		}
	
		if(!pat1.test($scope.custState.trim())) { 
			msg.push('invalid  state'); 
		}
	
		if(!pat1.test($scope.custZip.trim())) { 
			msg.push('invalid  zip'); 
		}  
		
		// 1.20 additions
		// custMiddle // added 1.8.20
		// custBirthDate
		// custGender 
        debugger;
		var gen = $scope.custGender.toUpperCase(); 
		if(gen !== 'M' && gen !== "F") {
			msg.push("invalid gender");
		}

	    if(!pMid1.test($scope.custMiddle)) {
			msg.push('invalid middle name');
		}

		if(!pDate.test($scope.custBirthDate.trim())) { 
			msg.push('invalid birth date'); 

		}  else {
			 

			var dateParm = {
				screen: "register",
				input: $scope.custBirthDate.trim(),
				valid: false,
				message: "",
				formatted: "" 
			}; 

			dateService.editDate(dateParm);

			if(!dateParm.valid) {
				
				msg.push('invalid birth date' );
			}
			else {
			 
				$scope.cust.custBirthDate = dateParm.formatted;
			} 

		} 
		
	//	console.log('editor msg length' + msg.length)
		debugger;
	
		if(msg.length === 0) {
			return true;
		}
 
		var messages = [];

		//* ie11 fix:
 
		
	     $scope.message = "";
		 var prefix = " *";

		for(i = 0; i < msg.length; i++) {

			var item = prefix + msg[i];
			//$scope.messages.push(item);
			$scope.message += item;

		}

	  
	
		return false;
	
	}
	 
 

}]);
