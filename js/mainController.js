
app.controller('mainController', ['$scope', '$location' ,  
                  function($scope, $location) {

// main app controller
 

    $scope.userSignedIn = false; // accessed by directive 'myLink'
    $scope.defaultMessage = "Good Morning time to be sure!... Insure!";
    $scope.customerFirst = "";
    $scope.customerLast = ""; 
    $scope.customerId = "";
    $scope.asterisk = "";
    $scope.menuSelect = "Link";
    $scope.class = "used in myNav directive"; 
    $scope.navMessage = $scope.defaultMessage; 

    var control = this;  
	control.$onInit = function() {

          $scope.friendlyDate = $scope.getCurrentDate();
    } 
    

    $scope.$on('$routeChangeStart', function($event, next, current) { 
        // ... you could trigger something here ...
        //alert('next in event');
        /*for(var a in next) {
            console.log('next ' + a + ' ' + next[a] + '.');
        }*/

        $scope.hiStart = false;
        $scope.hiClassic = false;
        $scope.hiRegister = false;
        $scope.hiSignin = false;
        $scope.hiAdmin = false;
        $scope.hiAbout = false;
        $scope.hiMenu = false;
        $scope.hiUpdate = false;
        $scope.hiClaim = false;
        $scope.hiHistory = false;
        $scope.hiInfo = false;

        var path = next["originalPath"];
        console.log('path is ' + path);
        switch(path) {
            case '/register': $scope.hiRegister = true; break;
            case '/classic': $scope.hiClassic = true; break;
            case '/start' : $scope.hiStart = true; break;
            case '/signin' : $scope.hiSignin = true; break;
            case '/admin' : $scope.hiAdmin = true; break;
            case '/about' : $scope.hiAbout = true; break;
            case '/hub' : $scope.hiMenu = true; break;
            case '/update' : $scope.hiUpdate = true; break;
            case '/claim' : $scope.hiClaim = true; break;
            case '/history' : $scope.hiHistory = true; break; 
            case '/info' : $scope.hiInfo = true; break;
        }

        console.log('hi reg, classic ' + $scope.hiRegister + ' ' + $scope.hiClassic);

      });

     

    $scope.getCurrentDate = function() { 

        var d = new Date(); 
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate(); 
        let hh = d.getHours();
        let mi = d.getMinutes();
        let ss = d.getSeconds();  
        let monthLiteral = this.findMonth(d.getMonth());
        friendlyDate = monthLiteral + ' '  + dd + ' ' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
        return friendlyDate;
    }


    $scope.findMonth = function(value) {

           var months = ['January', 'Feburary', 'March', 
                         'April', 'May', 'June', 'July', 'August', 
                         'September','October','November','December'];

            return months[value];

     }
 

    $scope.onClick = function() { console.log("click")}   

    $scope.onChangeMenu = function() {

        // change menu to dropdown or links.
        $scope.menuSelect = ($scope.menuSelect === "Link") ?
               "Nav" : "Link";  
    }
    
     $scope.onButton = function(clickedMenuLinkButtonValue) { 

                if( clickedMenuLinkButtonValue === "signout") {

                    this.signOut();
                    clickedMenuLinkButtonValue = 'start';
                }

                let goto = '/' + clickedMenuLinkButtonValue; 
				$location.path(goto); 
     }

     //TODO: remember class var to change highlight on todo to btn-xxx for goldenrod effect.
     
}]);
