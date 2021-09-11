// myLink.js  -  


app.directive('myLink', ['$location', 'styleFactoryService', 'authorizeStyleService', '$route', 
              function($location, styleFactoryService, authorizeStyleService, $route) {  
 
   return {
        
      // access to parent by default is scope.
      scope: false,
      restrict: 'EA',
      templateUrl: 'htm/myLink.htm', 
      controller: function($scope) { 

          var showStyleLink = false;
          var showColorLink = false;
          var colorLinkColor = "white";
          var styleLinkValue = "Style"; 

          $scope.onSignOut = function()  {   // ie11 no lambdas! 
         
            //https://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/
 
               $scope.userSignedIn = false;  
               $scope.customerFirst = "";
               $scope.customerLast = "";
               $scope.customerId = "";
               $scope.asterisk = "";
               $location.path('/start');   
         
          }

          $scope.onNextStyle = function()  {   

               debugger;
               var path = $location.path();
               var screen = path.substring(1);
               // does this screen use Styles ?
               var usesStyles = authorizeStyleService.areStylesAuthorized(screen);
               if(!usesStyles)
               {
                  return;
               }
               showStyleLink = true;
               styleFactoryService.getNextStyle(screen);
               debugger;
               // update style link
               var screenStyleObject = styleFactoryService.getCurrentStyleForScreeen(screen);
               styleLinkValue = screenStyleObject.internalClass; 
               // show color link if Solid or Outline
               debugger;
               var iclass = screenStyleObject.internalClass;
               var solid = "Solid";
               var outline = "Outline"; 
               var userColor = screenStyleObject.userColor;
               showColorLink = (iclass === solid || iclass === outline);
               if(showColorLink) {

                  colorLinkColor = userColor;
               }
               // refresh screen via mainController.
               debugger;
               //https://www.geeksforgeeks.org/how-to-reload-or-re-render-the-entire-page-using-angularjs/ 

               $route.reload();
                
            }

          $scope.onNextColor = function()  {   

               debugger;
               var path = $location.path();
               var screen = path.substring(1);
               styleFactoryService.getNextColor(screen); 
               // update color link
               debugger;
               var screenStyleObject = styleFactoryService.getCurrentStyleForScreeen(screen);
               colorLinkColor = screenStyleObject.userColor;  
               // change the color of the link
               colorLinkStyle = "border-style: none; background-color: black; color:"
                                  + colorLinkColor + ";";
               // refresh screen via mainController.
               debugger;
               
               $route.reload();
          }

      }

   };
   
}]);
