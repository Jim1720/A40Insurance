//
// customerService.js
//
// purpose share customer object between screens 
// and provide for custom directive 
// if factory must rtn function.


// book code wrong.
// the function must be passed as parm2 in the app service stmt.

app.service('customerService', function() {

      holdCustomer = {}

      this.tryme = function () {
            return "wow ok";
      }

      this.storeCustomer = function (cust) { 

            holdCustomer = cust;
      };

      this.getCustomer = function () { 
            return holdCustomer;
      };

    
});




