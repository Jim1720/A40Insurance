
// authorizeStyleService.js 

app.service('authorizeStyleService', ['appService',  function(appService) { 

     var list = ["update","claim"]; 

     this.areStylesAuthorized = function(screenName) {  
 
    
        var allowStyles = appService.getAllowStyles();
        if(allowStyles === false) {
       
           return false;
        } 

        var stylesAllowed = list.find(a => a.toString() == screenName);
        return stylesAllowed;

     } 
    
}]);