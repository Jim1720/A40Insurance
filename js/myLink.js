// myLink.js  -  


app.directive('myLink', ['$location', function($location) {  
 
   return {
        
      // access to parent by default is scope.
      scope: false,
      restrict: 'EA',
      templateUrl: 'htm/myLink.htm', 
      controller: function($scope) { 

          $scope.onSignOut = function()  {   // ie11 no lambdas! 
         
            //https://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/
 
               $scope.userSignedIn = false;  
               $scope.customerFirst = "";
               $scope.customerLast = "";
               $scope.customerId = "";
               $scope.asterisk = "";
               $location.path('/start');   
         
          }
      }

   };
   
}]);
