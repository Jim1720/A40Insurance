
app.controller('planSelectController', ['$http', '$scope',  '$location' ,
 'appService', 'customerService', 'tokenService', 'claimService',
 function($http, $scope , $location,
     appService, customerService, tokenService, claimService) {
  
    var control = this; 
	
	control.$onInit = function() {

        $scope.getPlans();
    }


    $scope.onCancel = function () {    

        $location.path('/hub');
    } 

    $scope.onPlanSelect = function(planName) {

        // update customer / intenal copy ?
        debugger;
        var cust = customerService.getCustomer();
        $scope.updateCustomer(cust, planName);

    }

     
    $scope.getPlans = function() {

        debugger;
		console.log('get Plans - ');

		debugger; 
        try {

            debugger;
            var url = appService.getAPIUrl();
            var readPlans = 'readPlans';
            $http.get(url + readPlans)  
            .then(function(data,status,headers,config) {

                debugger;   
                $scope.plans = data.data;  
                debugger;   
				// $scope.message = msg;
                        
            },  
            function(data,status,headers,config) {

                debugger;
                console.log('plan call fails status:' + status); 
                return null;
            });  

        }
        catch(err)
        {
            debugger;
            console.log("error encountered in plan read:" + err.message);
            return null;
            
        } 


	}
 
   
	$scope.updateCustomer = function (cust, planName) {   
			
        //$scope.messages = [];
       
 
        // note: controller must interolopate record since key is auto gen ed - same code as add.
        debugger;
       
        // update the customer plan.
        cust.custPlan = planName.trim();  
        customerService.storeCustomer(cust); // update scren reads this.

          
        var plan = planName.trim();
        var custId = cust.custId.trim(); 
        var planParm = {CustId: custId, CustPlan: plan};
        
        // add XSRF-TOKEN
        planParm['_csrf'] = tokenService.getToken(); 
        
        var json = JSON.stringify(planParm);

        // now the async stuff. 
        var url = appService.getAPIUrl();
        $http.put(url + 'updatePlan/', json)
        .then(function(data,status,headers,config) {

              // optionally set message and go to menu.
              //$scope.message = "Customer updated successfully."; 
              var msg = planName + " plan selected.";
              claimService.setPendingMessage(msg);
              $location.path('/hub'); 

        }, 
        function(data,status,headers,config) {

           console.log("Customer Update issue! it did not work. " +  status);

        }); 
             

}

 

}]);
