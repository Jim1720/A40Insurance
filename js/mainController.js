
app.controller('mainController', ['$scope', '$location', 'authorizeStyleService' ,
               'styleFactoryService',
                  function($scope, $location, authorizeStyleService,
                           styleFactoryService) {

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

    $scope.showStyleLink = false;
    $scope.showColorLink = false;
    $scope.internalClass = "Style";
    $scope.colorLinkColor = "dodgerblue";

    screenStyleObject = {

        screen : "",
        internalClass : "",
        externalClass : "",
        userColor : "",
        headerColor : "",
        messageColor : "",
        labelColor : "" 
    
    } 

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
        $scope.showStyleLink = false;
        $scope.showColorLink = false;
        $scope.internalClass = "Style";
        $scope.colorLinkColor = "dodgerblue";

        var path = next["originalPath"];
       // console.log('path is ' + path);
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

        /* change style and color links depending on screen  */

        if(path === undefined) {
            return;
        }
        
        debugger;
        var screen = path.substring(1);
        var stylesUsed = authorizeStyleService.areStylesAuthorized(screen);
        if(stylesUsed) {

            $scope.showStyleLink = true; // show style link
            $scope.styleLinkValue = "Style";
            // look for style object and check internal class ? show color link?
            screenStyleObject = styleFactoryService.getScreenStyleObject(screen);
            if(screenStyleObject !== null) {

                // style link has this value..
                $scope.styleLinkValue = screenStyleObject.internalClass;
                
                // screen has object assignment. if not defult everything.
                if(screenStyleObject.internalClass === "Solid"
                || screenStyleObject.internalClass === "Outline") {

                    // show color link.
                    $scope.showColorLink = true;
                    $scope.colorLinkColor = screenStyleObject.userColor;
                    // todo:  may add label or message color. check.
                } 
            }  
        }  

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
 

   // $scope.onClick = function() { console.log("click")}   

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

     /* copied from link controller ; have menu run this for 'signout' button. */

     $scope.OnMenuBtnSignOut = function()  {   // ie11 no lambdas! 
         
        //https://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/

           $scope.userSignedIn = false;  
           $scope.customerFirst = "";
           $scope.customerLast = "";
           $scope.customerId = "";
           $scope.asterisk = "";
           $location.path('/start');   
     
      }



     //TODO: remember class var to change highlight on todo to btn-xxx for goldenrod effect.
     
}]);
