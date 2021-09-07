app.controller('adminController', [ '$http','$scope', '$location', 'appService', 'tokenService',
               function($http, $scope, $location, appService, tokenService) { 

//$scope.message = "reg controller working."; 
console.log('admin controler');
$scope.message = "Enter admin user id and  password.";

$scope.adminSignin = function () {  

    debugger;  

    var id = $scope.admId;
    var pw = $scope.adminPassword; 
    var message = "";
    
    var action = 'adminSignin';  
    //var parms = `?id=${id}&pw=${pw}`; ie 11
    var parms = '?id=' + id + '&pw=' + pw;
    var url = appService.getAPIUrl();
    //
    var closureThis = this;
    
    $http.get(url + action + parms)
    .then(function(data,status,headers,config) {
         debugger; 

         var result = data['data'];
         if(result['Status'] === "Unsuccessful") {
            
            closureThis.message = result["Message"];
            return; 
         }

         // get token
         var token = result['Token']; 
         tokenService.setToken(token); 
         
         // next 2 lines must be in the .then to work properly
         appService.setAdminLoggedIn(); 
     
         $location.path('/adminaction');

    },
    function(Error) {

        $scope.message = "Unsuccessful admin signin.";
        return;

    }); 

    // This code runs ok and sets message ; have to set $scope using this means.
    if(this.message !== '') {
    
        $scope.message = this.message;
        return
    }

   

}

}]);