
// appService.js

app.service('appService', function() {

    // protect screens from URLs when not logged in.
    _customerLoggedIn = false;
    _adminLoggedIn = false;

    this.getAPIUrl = function() {
 
        //var url = "http://localhost:3200/"; 

        var url="https://project20a45serverjsb09142020a1.azurewebsites.net";
        
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
    
    
});
