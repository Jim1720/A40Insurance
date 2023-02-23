 

app.controller('updateController',
               ['$http','$scope', '$location','customerService', 
			   'claimService',
			  // 'dateEditService',
			    'dateService',
			   'appService',
			   'utilityService',
			   'tokenService',
		       'styleFactoryService',
			   function($http, $scope, $location, customerService,
				claimService,
				dateService,
				//dateEditService,
				appService,
				utilityService,
				tokenService,
				styleFactoryService) {  
 
	//* either put old pw on screen to change or if blank field
	//* make call to cust service before update call aft edits
	//* to put old password in update stream.

	var control = this; 
	$scope.messages = []; 
	$scope.message = "";
	
	control.$onInit = function() {
 

		// verify proper customer login
		if(appService.isCustomerLoggedIn() == false) {
			$location.path('/start');
		} 

		$scope.updateStartUp();  
		
    }

	$scope.updateStartUp = function() { 
		
		debugger;
		$scope.origional = ""; // store origional password 
		$scope.cust = customerService.getCustomer();
		var msg = claimService.getPendingMessage(); 

		if(msg !== null && msg !== '') {  

			$scope.message = msg; 
		}
  

		// trim current values
		utilityService.trimFields($scope.cust); 
	
		
		// load current values.
		$scope.custPass = ''; // loaded to blank if not keyed origioanl value forwarded .... 
		$scope.custFirst = $scope.cust.custFirst;
		$scope.custLast = $scope.cust.custLast;
		$scope.custPhone = $scope.cust.custPhone;
		$scope.custEmail = $scope.cust.custEmail;
		$scope.custAddr1 = $scope.cust.custAddr1;
		$scope.custAddr2 = $scope.cust.custAddr2;
		$scope.custCity = $scope.cust.custCity;
		$scope.custState = $scope.cust.custState;
		$scope.custZip = $scope.cust.custZip;
		// added 1.20
		$scope.custGender = $scope.cust.custGender;
		$scope.custMiddle = $scope.cust.custMiddle;
		$scope.custPlan = $scope.cust.custPlan; 
		// not on screen store it for update later....
		appService.setPlan($scope.custPlan);
		$scope.custBirthDate = 
			   $scope.showDateOnScreen($scope.cust.custBirthDate);
		$scope.custPass = "";
		$scope.custPass2 = "";

		//Note: screen fields are capped since the C# model fields are capped!!!!
		// 'convention confusion'

		// lookup any style settings for screen
		$scope.externalClass = "bg-style"; 
		debugger;
		/* default colors */  
		this.setColors("white","goldenrod","dodgerblue","goldenrod");
	 
		debugger;
		screenStyleObject = styleFactoryService.getScreenStyleObject("update");
		if(screenStyleObject !== null) {

			// set form display to picture, solid or back ground classes 'externalClass'. 
			$scope.externalClass = screenStyleObject.externalClass;
			var internalClass = screenStyleObject.internalClass; 
			var userColor = screenStyleObject.userColor;
			var headerColor = screenStyleObject.headerColor;
			var labelColor = screenStyleObject.labelColor;
			var messageColor = screenStyleObject.messageColor;
			debugger;
			if(internalClass === "Solid") {
		       this.setColors(userColor, headerColor, labelColor, messageColor);
			} 
			if(internalClass === "Outline") {
				this.setColors(userColor, "white", "dodgerblue", "white");
			 }
			if(internalClass === "Picture") {
				var white = "white";
				this.setColors(white, white, white, white);
			 }
			 if(internalClass === "Style") { 
				this.setColors("white","goldenrod","dodgerblue","goldenrod");
			 }
		} 
  
	}

	$scope.setColors = function(userColor, headerColor, labelColor, messageColor) {
         
        /* set left margin for claim register and update screens */
        //var claimMarginLeft = 0; // "50px";
        //var registerMarginLeft = 0; // "135px";
        //var marginLeft = "";
        //var onClaimScreen = document.getElementById("ClaimScreen");
        // this applies to the style classes bg-outline, bg-solid etc.
        //marginLeft = (onClaimScreen) ? claimMarginLeft : registerMarginLeft;
        // use window.onload to make sure parsing complete for 
        // this to work.

		debugger;
        
        let root = document.documentElement;
		//alert("udpate user color:" + userColor);
		root.style.setProperty('--user-color', userColor);
		root.style.setProperty('--h-color', headerColor);
		root.style.setProperty('--label-color', labelColor);
		root.style.setProperty('--message-color', messageColor);
		//root.style.setProperty('--margin-left', marginLeft); 
        
	}


	$scope.start = function () { 
		 
		$scope.$parent.start();
		
	} 
 
	$scope.onSignOut = function() {

		$scope.$parent.SignOut();

	}
	
	 $scope.showDateOnScreen = function(value)  { // ie 11 no lambda functions. 

		// when date is passed in customer object from register...
		// it is mm/dd/yyyy length 10 from new date routine ; use as is else
		// if length greater than 10:

		// format date on screen from database.
		// 2020-01-01 db to 01012020 screen. 
 
		if(value.length <= 10) {
			return value; // date from register..
		}

		// date from database.
        var dash = "-";
		var items = value.substring(0,10).split(dash);
		if (items.length !== 3) {
			return "?";
		}
		var yyyy = items[0]; 
		//var mm = items[1].padStart(2,'0'); // ie11 
		//var dd = items[2].padStart(2,'0');  
		// for ie11: 
		var mm = items[1];
		var dd = items[2];
		var slash = "/";
		var out = mm + slash + dd + slash + yyyy;  
		return out;
	}

	$scope.updateCustomer = function () {   
			
			$scope.messages = [];
			
			$scope.formatBirthDate = ''; 
			
			if($scope.editFields() === false) { 
				
			     return;
			}
	 
			// note: controller must interolopate record since key is auto gen ed - same code as add.
			debugger;
            if($scope.custPass === "") { 
				// preserve origional password if none entered.
				$scope.cust2 = customerService.getCustomer(); 
				var a = $scope.cust2.custPassword;
				var b = $scope.cust2.custPass;
				var usePassword = 'x';
				if (a != null || a != undefined) { 
					usePassword = a;
				}
				if (b != null || b != undefined) { 
					usePassword = b;
				} 

				$scope.cust.custPassword = usePassword; 

			} else { 
				// use new password value. 
				$scope.cust.custPassword  = $scope.custPass; 

			} 

			$scope.cust.custFirst = $scope.custFirst;
			$scope.cust.custLast  = $scope.custLast; 
			$scope.cust.email     = $scope.custEmail;
			$scope.cust.phone     = $scope.custPhone;
			$scope.cust.custAddr1 = $scope.custAddr1;
			$scope.cust.custAddr2 = $scope.custAddr2;
			$scope.cust.custCity  = $scope.custCity;
			$scope.cust.custState = $scope.custState;
			$scope.cust.custZip   = $scope.custZip; 
			$scope.cust.custMiddle = $scope.custMiddle;
			$scope.cust.custGender = $scope.custGender;  
			debugger;
			$scope.cust.custBirthDate = $scope.formatBirthDate;

			// clear password fields on screen at this pont.
			var clear = "";
			$scope.custPass = clear;
			$scope.custPass2 = clear;

			// get plan found on customer stored in appService
			$scope.cust.custPlan = appService.getPlan();

			// need to update customer internal copy be for async stuff
			// else it becomes null!
			customerService.storeCustomer($scope.cust);

			// add XSRF-TOKEN
			$scope.cust['_csrf'] = tokenService.getToken(); 

			// now the async stuff. 
			var url = appService.getAPIUrl();
			$http.put(url + 'update/', $scope.cust)
			.then(function(data,status,headers,config) {

				// callers must check Status/Message if 
				// they are sensitive to the email edit.
				
				debugger; 
			
				// print success message and transfer
				// $scope.messages[0] = "Customer updated successfully."; 
				$scope.message = "Customer updated successfully.";  
				

			}, 
			function(data,status,headers,config) {

				var message = ''; 

				if(status === 500) {
					
					message = "Server down or critical error : Please contact administerators.";
					console.log("Message: " + data.data); 

				} else {

					message = 'Customer not found.' 
				} 
				
				//$scope.messages[0] = message;
			    $scope.message = message;

			}); 
				 

	}

	

	$scope.editFields = function() {

	//	console.log('1a custId ' + $scope.custId);
	//	console.log('2a custId  ' + $scope.cust.custId);

		var msg = []; 
		var concat = ''; 
	
		var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
		var name2 = "^[a-zA-Z0-9.#\s]+"; // city names 
		var addr2 = "^[a-zA-Z0-9.#\s]*"; // addr 2 is not req allow space. * o,more
		var phone = "^[0-9]{10}|([0-9]{3})[0-9]{3}-[0-9]{4}$";
		//var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$"; 
		var date1 = "^[0-9\/]+$"; // dob  
		var mid1 = "^[a-zA-z]*$";  // * optional 
		var email = appService.getePattern(); // use A45 common pattern for emails. -flexable-
	 
		var pat1 = new RegExp(name1);
		var pat2 = new RegExp(name2); 
		var pat2a = new RegExp(addr2);
		var pPhone = new RegExp(phone);
		var pEmail = new RegExp(email); 
		var pDate = new RegExp(date1); 
		var pMid1 = new RegExp(mid1);

		debugger; 

		if($scope.custPass !== '' && !pat1.test($scope.custPass.trim())) { // edit new value entered.
					msg.push('invalid password. '); 
		}
		
		// note: custPassword read from db or entered above.
		// here we edit screen field.
		debugger;
		if($scope.custPass.trim() != '' && $scope.custPass.trim() !== $scope.custPass2.trim()) {
			msg.push('confirmation password does not match password. '); 
		}
	 
	
		if(!pat2.test($scope.custFirst.trim())) { 
			msg.push('invalid  first name '); 
		}
	
		if(!pat2.test($scope.custLast.trim())) { 
			msg.push('invalid  last name'); 
		}

		ePattern = appService.getePattern();

	
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
 
		if(!pMid1.test($scope.custMiddle.trim()))
		{
			msg.push('invalid middle initial');
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

		debugger;
		if(!pDate.test($scope.custBirthDate.trim())) { 
			msg.push('invalid birth date'); 

		}  else {
		 
			var dateParm = {
				screen: "update",
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
			 
				$scope.formatBirthDate  = dateParm.formatted;
			} 
		} 
	
		//console.log('editor msg length' + msg.length)
		debugger;
	
		if(msg.length === 0) {
			return true;
		} 

		// ie 11 compat:
 
		var lead = " *";

		$scope.message = "";
		for(i = 0; i < msg.length; i++) {
			
			var item = lead + msg[i];
			//$scope.messages.push(item);
			$scope.message += item; 
			
		} 
	
		return false;
	
	}
	 

}]);
