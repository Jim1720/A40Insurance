
// app.js
// 
// note: the [] is needed to create a new module else old one is reused. 
// work when app name is short! 

var app = angular.module('a40',["ngRoute"]); 

app.config(function($routeProvider) {

    debugger;  

    $routeProvider

    .when('/start',     { templateUrl: "htm/start.htm"})
    .when('/signin',    { templateUrl: "htm/signin.htm"})
    .when('/register',  { templateUrl: "htm/register.htm"})
    .when('/update',    { templateUrl: "htm/update.htm"})
    .when('/about',     { templateUrl: "htm/about.htm"})
    .when('/admin',     { templateUrl: "htm/admin.htm"}) 
    .when('/adminaction',  
                        { templateUrl: "htm/adminaction.htm"}) 
    .when('/listcustomers',   { templateUrl: "htm/listcustomers.htm"})
    .when('/classic',   { templateUrl: "htm/classic.htm"})
    .when('/about',     { templateUrl: "htm/about.htm"})
    .when('/info',      { templateUrl: "htm/info.htm"})
    .when('/claim',     { templateUrl: "htm/claim.htm"})
    .when('/history',   { templateUrl: "htm/history.htm"})
    .when('/signout',   { templateUrl: "htm/start.htm"})
    .when('/adjust',    { templateUrl: "htm/claimAdjustment.htm"}) 
    .when('/hub',       { templateUrl: "htm/citycenter.htm"}) 
    .when('/plan',      { templateUrl: "htm/plan.htm"})
    .otherwise('/start');
 
});

