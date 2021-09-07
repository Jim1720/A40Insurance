
// myNav.js  -  


app.directive('myNav',  function() {  

         return { 
            scope: false, // use parent scope/need access to login var for link setting.
            restrict: 'E',
            templateUrl: 'htm/myNav.htm', 
            controller: function($scope) { 

               $scope.class="btn-outline-primary st1 b1" 
            
               $scope.onHover = function () { 
                  $scope.class="btn-outline-primary st1 b1" 

                } 
                     
                $scope.onLeave = function () { 
                  $scope.class="btn-outline-warning st1 b1" 

                }

                // should be here.
                $scope.onSignOut = function () {

                }

             
            } 
         }
 
}); 
