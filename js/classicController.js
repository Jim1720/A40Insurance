
// classicController.js 

app.controller('classicController', ['$scope', function($scope) { 
           
     
      // ref:  get carousel to slide. 
        
      // https://stackoverflow.com/questions/66506091/bootstrap-carousel-does-not-auto-slide-when-routing-back-in-angular
      // carousel was not starting until page refreshed.
 

      var hiddenElement = document.getElementById("carousel"); 

      setInterval(() => {
         hiddenElement.click();
      }, 10000);


}]);


 
