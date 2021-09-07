app.controller('adminActionController', [ '$http','$scope', '$location', 'appService', 'tokenService',
               function($http, $scope, $location, appService, tokenService) { 

//$scope.message = "reg controller working.";  
$scope.message = "Enter needed fields and select action required.";

// check for valid admin login
debugger;
var a = appService.isAdminLoggedIn(); 

if(appService.isAdminLoggedIn() === false)
{
    $location.path('/start'); 
}

$scope.onCustomerList = function () {  
    
    $location.path('/listcustomers');

}

 
$scope.onResetPassword = function () {

    console.log("on reset password - ");
    debugger;
    $scope.form = {};
    $scope.form.custId = $scope.curCustId;
    $scope.form.newPassword = $scope.newPassword;
    $scope.form.newPass2 = $scope.newPassword2;
    debugger;
    var msg = this.editPasswordFields($scope.form);
    if (msg.length > 0) {
        $scope.message = msg;
        return;
    }
    debugger;
    this.resetPassword($scope.form);
}

$scope.editPasswordFields = function() {

        debugger;   
        //TODO: add regex expression checker.
        var msg = "";
        //var { custId, newPassword, newPass2 } = $scope.form; ie11

        var custId = $scope.form.custId;
        var newPassword = $scope.form.newPassword;
        var newPass2 = $scope.form.newPass2;

        if(custId === null || custId === undefined)
        {
            msg = "enter customer id.";
            return msg;
        }
        if(newPassword === null || newPassword === undefined)
        {
            msg = "enter new password.";
            return msg;
        }
        if(newPass2 === null || newPass2 === undefined)
        {
            msg = "enter confirmation password.";
            return msg;
        }

        
		var pattern = new RegExp("^[A-Za-z0-9]+$");  
        var res = pattern.exec(custId); 
		if(pattern.test(custId) == false) {
			msg  = "Customer Id must be all letters or numbers.";
			return msg;
        } 
        var res = pattern.exec(newPassword); 
		if(pattern.test(newPassword) == false) {
			msg  = "Password must be all letters or numbers.";
			return msg;
        } 
        var res = pattern.exec(newPass2); 
		if(pattern.test(newPass2) == false) {
			msg  = "Conform Password must be all letters or numbers.";
			return msg;
        } 
        
        if(newPassword !== newPass2)
        {
            msg = "confirm password does not match password."
            return msg;
        }
 
        return msg;
}

$scope.onResetCustomerId = function () {  
    
    console.log("on reset customer id - ");
    debugger;
    $scope.form = {};
    $scope.form.curCustId = $scope.curCustId;
    $scope.form.newCustId = $scope.newCustId;  
    $scope.form.newCustId2 = $scope.newCustId2;
    debugger;
    var msg = this.editCustomerFields($scope.form);
    if (msg.length > 0) {
        $scope.message = msg;
        return;
    }
    debugger;
    $scope.form.custId = $scope.curCustId.toString(); //sent to server
    $scope.form.newCustId = $scope.form.newCustId.trim(); // sent to server.
    var result2 = this.doTheReset();

}


$scope.editCustomerFields = function() {

    debugger;   
    //TODO: add regex expression checker.
    var msg = "";
   // var { curCustId, newCustId, newCustId2 } = $scope.form;
    var curCustId = $scope.form.curCustId;
    var newCustId = $scope.form.newCustId;
    var newCustId2 = $scope.form.newCustId2;
    if(curCustId === null || curCustId === undefined)
    {
        msg = "enter customer id.";
        return msg;
    }
    if(newCustId === null || newCustId === undefined)
    {
        msg = "enter new cust id.";
        return msg; 
    }
    if(newCustId2 === null || newCustId2 === undefined)
    {
        msg = "enter confirmation customer id.";
        return msg;
    }
    debugger;
    if(curCustId.trim() === '') {
        msg = "customer id blank";
        return msg;
    }
    if(newCustId.trim() === '') {
        msg = "new customer id blank..";
        return msg;
    }
    if(newCustId2.trim() === '') {
        msg = "confirm customer id blank.";
        return msg;
    }

    
    var pattern = new RegExp("^[A-Za-z0-9]+$");   
    if(!pattern.test(curCustId)) {
        msg  = "Customer Id must be all letters or numbers.";
        return msg;
    }  
    if(!pattern.test(newCustId)) {
        msg  = "New Customer id must be all letters or numbers.";
        return msg;
    }  
    if(!pattern.test(newCustId2)) {
        msg  = "Confirm customer id must be all letters or numbers.";
        return msg;
    } 
    
    if(newCustId !== newCustId2)
    {
        msg = "confirm new customer id does not match."
        return msg;
    }

    return msg;
}

$scope.resetPassword = function () { 

    console.log('admin action reset password'); 
    $scope.form['_csrf'] = tokenService.getToken(); 

    try {

        debugger;
 
        var url = appService.getAPIUrl();
        $http.put(url + 'resetPassword/',$scope.form)
        .then(function(data,status,headers,config) {

              // print success message and transfer 
              $scope.message = "Password Reset Successfully.";   

        }, 
        function(data,status,headers,config) {

            console.log("reset pass fails.") 
            $scope.message = "reset password did not work. " +  status; 
        });

    }
     catch(err)
     {
             
        console.log("error encountered in reset password:" + err.message);
        
     }

    return;
}



$scope.doTheReset = function () { 

    console.log('admin action customer id reset'); 
    console.log($scope.form);

    try {

        debugger;
 
        var url = appService.getAPIUrl(); 
        $scope.form['_csrf'] = tokenService.getToken();
        
        $http.put(url + 'resetCustomerId/',$scope.form)
        .then(function(data,status,headers,config) {

              // print success message and transfer 
              $scope.message = "Customer id Reset Successfully.";   

        }, 
        function(data,status,headers,config) {

            console.log("reset cust id fails.") 
            $scope.message = "customer id reset did not work. " +  status; 
        });

    }
     catch(err)
     {
             
        console.log("error encountered in reset customer id:" + err.message);
        
     }

    return; 

}

}]);