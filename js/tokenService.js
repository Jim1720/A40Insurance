
// tokenService.js
 

app.service('tokenService', [ '$http', 'appService', function($http, appService) { 

               
    token = {};

    this.setToken = function(inputObject) {  
    
        var json = JSON.parse(inputObject); 
        var a45 = json['A45Object']; 
        var token = a45['token'];   
        this.token = token;

    }

    this.getToken = function(object) {

        return this.token;

    } 

    
	this.collectToken = function() {   

        // not used.
     //   console.log("collect token") 
        debugger;
        var here = this;
        var url = appService.getAPIUrl();
        $http.get(url + 'gettoken')  
        .then(function(data,status,headers,config) {  
            debugger; 
            var a45Object = data.data['A45Object'];  
            var token = a45Object['token'];  
            here.token = token; 
            return true;
                     
        },  
        function(data,status,headers,config) {

            console.log( "tokenService: collect token: Not found or issue: " + status);
            return false;

        });  

    }   

}]);