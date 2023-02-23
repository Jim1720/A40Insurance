
// appService.js

app.service('appService', function() {
 

    // protect screens from URLs when not logged in.
    _customerLoggedIn = false;
    _adminLoggedIn = false; 
    _reloadHistoryRoute = false;
    _ePattern = '';
    _plan = "";

    // configure nav bar settings here.
    usingStay = true;
    usingFocus = true;
    usingActions = true;
    usingNav = true;

    this.usingStay = function () { return usingStay; } 
    this.usingFocus = function () { return usingFocus; } 
    this.usingActions = function () { return usingActions; } 
    this.usingNav = function () { return usingNav; }

    this.getAPIUrl = function() {
  

         var url =  "https://azure/";

         // url = "http://localhost:3200/";
 
        return url;
         
    }

    // turn style on/off 
    this.getAllowStyles = function() {

        return true;
    }
    

    this.setCustomerLoggedIn = function() {
        _customerLoggedIn = true;
    }
    this.setAdminLoggedIn = function() {
        _adminLoggedIn = true;
    }

    this.isCustomerLoggedIn = function() {
        return _customerLoggedIn;
    }
    this.isAdminLoggedIn = function() {
        return _adminLoggedIn;
    }
    
    this.setCustomerLogout = function() {
        this._customerLoggedIn = false;
    }
    this.setAdminLoggedOut= function() { 
        this._adminLoggedIn = false;  
    }


    this.setReloadHistoryRoute = function(value) {

        _reloadHistoryRoute = value;
        console.log("app set service reload value " + _reloadHistoryRoute);

    }
    this.getReloadHistoryRoute = function() {

        console.log("app get  service reload value " + _reloadHistoryRoute);
        return _reloadHistoryRoute;
    }

    this.setePattern = function (value) {

        _ePattern = value;
    }

    this.getePattern = function() {

        return _ePattern;
    }

    this.setPlan = function(value) {
        _plan = value;
    }

    this.getPlan = function() {
        return _plan;
    }
    
    
});
