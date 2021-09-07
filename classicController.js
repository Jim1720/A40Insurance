
// classicController.js 

app.controller('classicController', ['$scope', function($scope) { 
           
     

      var myCarousel = document.getElementById("theCarousel");
      var carousel = new bootstrap.Carousel(myCarousel) 

      function rideTheCarousel() { 
 
        carousel.next(); 

      } 

}]);


 
