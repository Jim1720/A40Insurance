
app.controller('cityCenterController', [ '$scope',  '$location' , 'appService', 'claimService',

 function($scope, $location, appService, claimService) {
 
// CityCenterController - /hub - services as main menu.
// 

var control = this; 
$scope.message = '';

control.$onInit = function() {
 
        
    // verify proper customer login
     if(appService.isCustomerLoggedIn() == false) {
         $location.path('/start');
     } 
     debugger;
     var msg = claimService.getPendingMessage();
     if(msg != '') {
         $scope.message = msg;
     }

 } 

$scope.update = function () {    
 
     $location.path('/update');
} 

$scope.claim = function () {  
    
    $location.path('/claim');
} 

$scope.history = function () {  

    
    $location.path('/history');
} 

$scope.plan = function () {  

    
    $location.path('/plan');
}


$scope.signout = function () {   
    
    $scope.$parent.$parent.userSignedIn = false; 
    $scope.$parent.$parent.asterisk = '  ';
    $scope.$parent.navMessage = " ";  
    appService.setCustomerLogout(); 
    $location.path('/start');
}     

}]);
