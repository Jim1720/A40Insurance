app.controller('listCustomersController', [ '$http','$scope', '$location', 'appService', 
               function($http, $scope, $location, appService) { 

//$scope.message = "reg controller working."; 
console.log('list customers controler'); 
var control = this; 

control.$onInit = function() {
 
    
    if(appService.isAdminLoggedIn() === false)
    {
        $location.path('/start'); 
    }
 
    getCustomerList();  
    
}

getCustomerList = function () {
 
		debugger;   
        try {

            debugger;
            var url = appService.getAPIUrl();
            $http.get(url + 'custList/')  
            .then(function(data,status,headers,config) {

                debugger;  
                var customerList = [];
                customerList = data.data; 
                // do any formatting
                debugger;

                /* concatenate name first and name last */
                // for(let customer of customerList) { // customer array

                for(c = 0; c < customerList.length; c++) { // ie 11 use for.

                    var customer = customerList[c];
                    customer.name = customer.custFirst + " " + customer.custLast;
                    customer.address = customer.custAddr1.trim()  + " " +
                                       customer.custAddr2.trim() + " " +
                                       customer.custCity.trim() + " " +
                                       customer.custState.trim() + " " +
                                       customer.custZip.trim(); 
 
                };

				$scope.customerList = customerList;
				
				var msg = '';
				switch($scope.customerList.length) {
					case 0: msg = 'no customers found'; break;
					case 1: msg = '1 customer found'; break;
					default: msg = $scope.customerList.length + ' customers found'; break; 
				};
				$scope.message = msg;
                        
            },  
            function(data,status,headers,config) {

                debugger;
                console.log('customer list  fails status:' + status); 
                return null;
            });

        }
        catch(err)
        {
            debugger;
            console.log("error encountered in customer list  read:" + err.message);
            return null;
            
        } 



}


}]);