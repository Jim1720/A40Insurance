// customDirective.js

app.directive('footerDirective', function () {

        return {
            restrict: 'A',
            template: "This site welcomes your business."
            
        }
});

app.directive('headerDirective', function () {

    return {

        restrict: 'A',
        template: "{{message}}",
        controller: function() {

            if($scope.customerID == null)
                message = "Good Morning, time for insurance.";
            else
               message = "{{cust.First}} {{cust.Last}} signed in.";

        }
        
    }
});