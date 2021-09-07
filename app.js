
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


 // 12.15 class starttitle used for menu items not display-4.
 // 12.15 fixed parm to .collapse to be ('toggle')
 // 12.15 start - moved buttons below pictures and changed to links
 // so only words show not as full buttons.... delete bg bg-primary leave st1 b1 classes - hi lite hover.
 // 12.15 removed bg-dark (looked like gray) and used simple background = black.
 // 12.15 clean up start menu
 // 12.15 *issue* start bounces left/right - am sure there is a fix for this!
 // 12.15 added 'classic.htm' and 'about.htm'.
 // 12.15 TODO fix classic and neaty about menu.

 // 6.27 - a45 server updated to work with A40Insurance. 
 //      - change URL on Add,Signin,and Update to new A45.
 //      - A40Insurance
 //      ** add customer working but need to use all fields edit off.
 //      -- coded register $location and customerService to get to update screen.
 //
 // 6.28 -- major -- it's not an observable! but a promise therefore must use
 //         .then(func,err func) and not .success .error syntax!
 //        major - $http missing from injector [] list but no error thrown nothing happens
 //        major - menu path myNav fixed.
 //        major - will add links to my nav by default for consistency
 //
 //        ** registration, sign-in work. some fields missing
 //        ( ) : test and complete update password not copying to first screen.
 //        ** menu switch installed.
 //         
 //  7.2 - adding claim and history links.
 //  7.17 - add history coding; add myLink buttons at top;
 //       - added 'historyService' onInit could not call local function so used service.
 //
 //  7.17 - history screen basically works - issue was calling function in onInit
 //         life cycle event using .this. it was not defined so had to use javascript
 //         local function to read history.
 //         TODO: fix claim add to put in custId to database
 //         TODO: usse bootstap class when onHover link buttons
 //         TODO: consider removing drop down 
 //         TODO: fit finish on all screens. logic check out.
 // 
 //   7.19 - fit finish on reg,update and claim forms.
 //
 //   8.2 - fixed edits on upd,reg,clm to be looser with spaces
 //         ng-show on LI not A 
 //         bg-dark top band and buttons
 //         buldled error messages to LI elements
 //         fixed signout function to set user signed in = false.
 //
 //   8.3 - udpate: if password not entered use orig value to update.
 //   8.3 - fixed misssing update code to copy to update-object.
 //   8.3 - claim history - for(let claim of claims) need to be used - standard javascript loop array.
 //   8.4 - fixed cust password logic.
 //
 //   12.23 - pulled admin screen from a30 added links adjusted ng-model tags
 //           created ng-controller for admin.
 //   12.23 - .contorl-label added to class with doger blue font.
 //   12.23 - I made this error before: must put admin.js in the include list in top app.
 //   12.23 -- reset password is now working!
 //   12.23 -- LIST CUSTOMERS is now working.
 //
 //   12.24 -- fixing change password
 //   12.24 -- fixing admin signin
 //
 //    1.8  -- add dob, gender to register screen
 //    1.8  -- add claim type logic to claim screen
 //    1.8  -- add type display to history
 //    1.8  -- add adjust, pay, and void actions to history
 //    1.8  -- add claim service to void 
 //    1.8  -- add adjust.htm to key adjustment to copied claim
 //    1.8  -- add payment htm probably
 //
 //    1.8  -- uat needed for reg,upate
 //    1.8  -- need code payment calculation 
 //    1.8  -- customer reset
 //    1.8  -- adjustment
 //    1.8  -- fix birth date dash
 //    1.8  -- now . claim add date fails
 //
 //    1.14 - fixed claim service its an object not a function
 //           functions inside
 //    1.14 - fixed message initial 
 //
 //    1.15 - getDate is needed for claim id.
 //           fixed dateadded(currentDate) and
 //           clam id number.
 //
 //    2.28 - ie11 fixes:
 //           define $scope.messages = []  in update
 //           remove pad left in update
 //           replace 2 for let's by for(int i=0; etc.) usages : history
 //           fixed this line:   $scope.cust.Pass = "";  in update.
 //           update: replaced for(let) with for(i=) when loading messages.
 //           registor: for.msgs ( )
 //           claim: for.msgs ( )
 //           history: ( )
 //
 //    3.3 - appService created to get 1 url for the API calls.
 //    3.3 - numerious ie11 fixes syntax:
 //          a. get rid lambda functions
 //          b. rid of decompositions ie var { a, b } = some object.
 //          * still has blank screen.
 //          c. do we need polyfill for angular.js as ang  2+ does.
 //
 //    3.14  March 2020 March 3 U1 version pulled in
 //          a. drop downs for state gender
 //          b. ( ) js core 3 
 //          c. fix drug/eyeware eidt. used pat2.
 //          d. url check 
 //          e. port date routine from 30 consider this.
 //          f. add TDD for date routine.
 //
 //     5.4  Adding environment call to get promotion code and adm password.
 //
 //     5.18 - copied from May 06 C
 //
 //     5.18 - (X)c added password to custlist.
 //     5.18 - (x) wild routes - found already coded : check. 
 //     5.18 - (x)c admin logon protect
 //     5.18 - (x) cust logon protect  x-update, x-claim,  x-history, x-logout, -adm-reset-login-prot.
 // 
 //
 //     5.18 - (fixed) signin admin breaks url protection? vars in appService fixed.
 //     5.18 - (x )c - add admin protection (admin signout to reg too.)
 //     5.18 - (x )c cust signin breaks admin protection
 //     5.18 - (x )c add reg - admin signout 
 //     5.18 - (ok )c reanamed to signoutController.
 //     5.18 - (ok )n reg,signin - use 1 $parent as does signout - they are siblings.
 //
 //
 //     5.18 - ( )c medical date default adj
 //     5.18 - ( )c claim, adj messages on update. 
 //                should adjustments return to claim screen. like 30?
 //                + claim add message works but
 //                - no message on update
 //                ? check adj to/from fields on db and on hist screen (some missing)
 //
 //     5.18 - (NOT WORK IN BROWSER)c .env to read URL from .env file?! (app.service)
 //     5.18 - (n/a ) console log extradition! turn messages on/off in prod. 
 //
 //      5.18 (doesnt'work.)c npm install dotenv
 //           this did not work. harding url in app. service.
 //           require('dotenv').config() here and  in .env file   name=value lines.
 //           in program here: lookin process.env  (appService).
 //      
 //
 //     5.18 - verify adjustment logic and message
 //
 //     5.18 - dotenv just does not work.
 //
 //     ============= DIRECTIVE REWRITE AND remove signoutController -- mis-codeed! --- 
 //     5.18 (works) * at long last the directive rewrite to fix link issue is
 //            working. repeated sign(in,outs) work. 
 //            However, the adm signin must SIGN USER OUT TO CLEAR CUST LINKS.
 //     ================================================================================
 //  
 //     5.18 - ( )c looks ok: adj msg was working until i moved msg to new row
 //     5.18 - (NOPE) .env did not work use node.js to read from  filename=.url in root dir
 //             THIS WILL NOT WORK BECAUSE YOU ARE IN THE BROWSER.
 //             just put the url in the file:   http://xxxxx 
 //     5.18 - can proceed to 50.
 // 
 //     5.21 ( )c revert to prior code:
 //               total charge edit blows up and no error message so add fails server error
 //
 //     5.21 (fixed)c claim shows adj when it is not 
 //              used claim status not adjId field to define this as adjustment claim
 //              it's more consistent sine I use status elsewhere.
 //
 //     5.22 (fixed) : adjustment dates all is good.
 //     5.22 (ok) : $ on total charge - does not show pay amt.
 //
 //     6.13 ( ) - revise token calls to reg, signin, admin signin.
 //     6.16 ( ) - pull out console logs
 //
 //     7.15 ( ) - added hub (cityCenter) and plan screens.
 //     7.15 ( ) - consider light link 
 //     7.15 ( ) - use service and plan to caculcate sub charge and pay to reduce balance owed.
 //              - each claim type has a specific subset of services to select.
 //
 //