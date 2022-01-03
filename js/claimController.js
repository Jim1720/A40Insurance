
app.controller('claimController', [ '$http','$scope', '$location', 'customerService' , 
                'claimService', 
                'appService',
                'dateService',
                'utilityService',
                'tokenService', 
                'styleFactoryService',
                'historyService',
               function($http, $scope, $location, customerService,
                  claimService, appService, dateService, utilityService, 
                  tokenService, styleFactoryService, historyService) { 
 
//$scope.message = "reg controller working."; 
//console.log('claim controler');
$scope.message = "enter a new claim"
$scope.showMedical = true;
$scope.showDental = false;
$scope.showVision = false;
$scope.showDrug = false;
$scope.fileButton = "File Medical Claim";
$scope.titleType = "Medical";
$scope.adjustment = false; // process adjusted claim
$scope.adjustedId = ''; 
$scope.defaultType = "m";
$scope.defaultClaimTypeLitreal = "Medical";
$scope.selectedType = $scope.defaultType;
$scope.customerPlan = ''  

// adjustment puts service in this field so
// drop down will select correct serviceEntry object,
// else it picks the first on for the claim type
// 
$scope.adjustementServiceName = ''; 
 

// services - load service drop  down.
$scope.allServices = [];
$scope.typeServices = [];
$scope.serviceEntryObject; // drop down model.
$scope.defaultValue = "";

var control = this;   
 
	
control.$onInit = function() {
  
    // verify proper customer login
    if(appService.isCustomerLoggedIn() == false) {
        $location.path('/start');
    }

    $scope.adjustment = false; // process adjusted claim flag. 
    var c = claimService.getClaim();
    if(c !== null && c !== undefined) { 
        $scope.adjustment = true;
        $scope.adjustedId = c.ClaimIdNumber;
        $scope.loadAdjustmentFields(c); 
        $scope.getListOfAllServices(c.ClaimType);
        var msg = claimService.getPendingMessage();
        // css blue class make it really blue otherwise black on claim add...
        let root = document.documentElement; 
        var adjustmentFieldColor = "Blue";
        root.style.setProperty('--adj-color', adjustmentFieldColor);
        // fix: message2 = msg;
    }  else { 

        // non-adjustment - default claim type is 'm' = Medical.
        $scope.getListOfAllServices("Medical"); 
    }

    debugger;
 	// lookup any style settings for screen
     $scope.externalClass = ""; 

     /* default colors */ 
     $scope.setColors("white","goldenrod","dodgerblue","goldenrod");
     
	 debugger;
     screenStyleObject = styleFactoryService.getScreenStyleObject("claim");
     if(screenStyleObject !== null) {
         
         // set form display to picture, solid or back ground classes 'externalClass'. 
         $scope.externalClass = screenStyleObject.externalClass;
         var internalClass = screenStyleObject.internalClass; 
         var userColor = screenStyleObject.userColor;
         var headerColor = screenStyleObject.headerColor;
         var labelColor = screenStyleObject.labelColor;
         var messageColor = screenStyleObject.messageColor; 
         
         if(internalClass === "Solid") {
            $scope.setColors(userColor, headerColor, labelColor, messageColor);
         }
         if(internalClass === "Outline") {
            $scope.setColors(userColor, "white", "dodgerblue", "white");
         }
         if(internalClass === "Picture") {
            var white = "white";
            $scope.setColors(white, white, white, white);
         }
         if(internalClass === "Style") { 
            this.setColors("white","goldenrod","dodgerblue","goldenrod");
         }
     } 
}
 
 
$scope.setColors = function(userColor, headerColor, labelColor, messageColor) {
         
    /* set left margin for claim register and update screens */
    //var claimMarginLeft = 0; // "50px";
    //var registerMarginLeft = 0; // "135px";
    //var marginLeft = "";
    //var onClaimScreen = document.getElementById("ClaimScreen");
    // this applies to the style classes bg-outline, bg-solid etc.
    //marginLeft = (onClaimScreen) ? claimMarginLeft : registerMarginLeft;
    // use window.onload to make sure parsing complete for 
    // this to work.
 
    
    let root = document.documentElement; 
    root.style.setProperty('--user-color', userColor);
    root.style.setProperty('--h-color', headerColor);
    root.style.setProperty('--label-color', labelColor);
    root.style.setProperty('--message-color', messageColor);
    //root.style.setProperty('--margin-left', marginLeft); 
    //alert(userColor + " " + labelColor);
    
}

$scope.loadAdjustmentFields = function (c) {

    // trim fields
    utilityService.trimFields(c);

    var defaultDate = "01011753";

    $scope.custId = c.custId;
    $scope.ClaimDescription = c.ClaimDescription;
    $scope.PatientFirst = c.PatientFirst;
    $scope.PatientLast = c.PatientLast;
    $scope.Diagnosis1 = c.Diagnosis1;
    $scope.Diagnosis2 = c.Diagnosis2;
    $scope.Procedure1 = c.Procedure1;
    $scope.Procedure2 = c.Procedure1;
    $scope.Physician = c.Physician;
    $scope.Clinic = c.Clinic;
    $scope.DateService = this.showDateOnScreen(c.DateService);
    $scope.DateConfine = this.showDateOnScreen(c.DateConfine); 
    $scope.DateRelease = this.showDateOnScreen(c.DateRelease); 
    if($scope.DateConfine == defaultDate) { 
       $scope.DateConfine = "";
    }
    if($scope.DateRelease == defaultDate) { 
        $scope.DateRelease = "";
     }
    $scope.ToothNumber = c.ToothNumber;
    $scope.Eyeware = c.Eyeware;
    $scope.DrugName = c.DrugName; 
    $scope.TotalCharge = c.TotalCharge;
    $scope.ClaimType = c.ClaimType; 
    $scope.PlanId = c.PlanId;
    $scope.ClaimStatus = c.ClaimStatus;  
    $scope.Service = c.Service;

    // will populate dropdown after services loads...
    $scope.adjustementServiceName = c.Service;
    //
    $scope.ServiceItem = " ";
    $scope.Location = " ";
    $scope.PaymentAmount = 0;
    $scope.PaymentDate = "1753/01/01";
    $scope.PaymentPlan = " ";
    $scope.AppAdjusting = " ";
    $scope.Referral = " ";
    $scope.PaymentAction = " "; 
    $scope.AppAdjusting = "A40";

    

}

$scope.fileClaim = function () { 
 
  // console.log('submit claim');

   $scope.messages = [];

   $scope.claim = {};
 
   $scope.claim.ClaimType = $scope.selectedType; // fixed 2.24
   $scope.claim.ClaimIdNumber = this.getClaimIdNumber(); 
   $scope.claim.ClaimDescription = $scope.ClaimDescription;
   $scope.claim.PatientFirst = $scope.PatientFirst;
   $scope.claim.PatientLast = $scope.PatientLast;
   var customer = customerService.getCustomer(); 
   var custId = customer.custId; 
   $scope.claim.PlanId = customer.custPlan; // will be edited.
   $scope.claim.CustomerId = custId; 
   $scope.claim.Procedure1 = $scope.Procedure1;
   $scope.claim.Procedure2 = "";
   $scope.claim.Diagnosis1 = $scope.Diagnosis1;
   $scope.claim.Diagnosis2 = "";
   $scope.claim.Physician = $scope.Physician;
   $scope.claim.Clinic = $scope.Clinic; 
   $scope.claim.DateConfine = $scope.DateConfine;
   $scope.claim.DateRelease = $scope.DateRelease;  
   $scope.claim.DateService = $scope.DateService;
   $scope.claim.ToothNumber = $scope.ToothNumber; // feat rev 1
   $scope.claim.DrugName = $scope.DrugName;
   $scope.claim.Eyeware = $scope.Eyeware;
   $scope.claim.DateAdded = this.getCurrentDate();
   $scope.claim.AdjustedClaimId = "";
   $scope.claim.ClaimStatus = "Entered";

   // 7.24 relese 2 
   $scope.claim.CoveredAmount = "0.0";
   $scope.claim.BalanceOwed = "0.0";
   $scope.claim.CustomerPlan = this.custPlan;

   // 2.24 compat
   var defaultDate = "01/01/1753"
  $scope.claim.AdjustedDate = defaultDate;
  $scope.claim.AdjustedClaimId = " ";
  $scope.claim.AdjustingClaimId = " "; 
  $scope.claim.ServiceItem = " ";
  $scope.claim.Location = " ";
  $scope.claim.PaymentAmount = 0;
  $scope.claim.PaymentDate = defaultDate;
  $scope.claim.PaymentPlan = " ";
  $scope.claim.AppAdjusting = " ";
  $scope.claim.Referral = " ";
  $scope.claim.PaymentAction = " "; 
  $scope.claim.AppAdjusting = " "; 

   var result = this.editClaim(); 
   if(result === false) {

      return;
   } 

  // set service on object selected from service dropdown box.  
  var item = $scope.serviceEntryObject['ServiceName'];
  $scope.claim.Service =  item.toString().trim(); 

 
   this.clearByType();  
   if($scope.adjustment) {
      this.setAdjustingFields();
   }
 
   $scope.calcualateTotalCharge(); 
  

 
   

}
 

 
$scope.calcualateTotalCharge = function() {

    // determine total charge based on service and plan used.
    // paid = service cost * plan percent. BalanceOwed is updated for customer payment. 
    // get service cost 

    // var serviceUsed = $scope.typeServices.filter(ts => ts["ServiceName"] === $scope.claim.Service); 
    //  ie 11 
    var cost = 0.0; 
    var item = $scope.serviceEntryObject['ServiceName'];
    var claimService = item.toString().trim();
 
    for(var i = 0; i < $scope.typeServices.length; i ++) {

        var tsRow = $scope.typeServices[i];
        var tsName = tsRow['ServiceName'].toString().trim(); 
        if(tsName === claimService) {

            cost = parseFloat(tsRow['Cost']);
            break;

        } 
    }
    //var row = serviceUsed[0];
    //var cost = parseFloat(row["Cost"]);
    // get plan percent to cover 
    var planName = $scope.customerPlan;
    var closureThis = this;    

    $scope.getPlanPercent(planName,cost,closureThis);
   
}  

$scope.getPlanPercent = function(planName, cost , closureThis) {
 
  //  console.log('get Plans - ');
    var planName = planName.trim();
 
    try {
 
        var url = appService.getAPIUrl();
        var readPlans = 'readPlans';
        $http.get(url + readPlans)  
        .then(function(data,status,headers,config) {
 
            var plans = [];
            plans = data.data;  
            // find percent matching plan name
            var percent = 0.0;
            for(var i=0; i < plans.length; i++) {
                var row = plans[i];
                var name = row['PlanName'].toString().trim();
                if(name == planName) {

                    percent = parseFloat( row['Percent'] );
                    break;

                }
            }
            $scope.finishCalculation(percent, cost , closureThis);

                    
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

$scope.finishCalculation = function(percent,cost,closureThis) {
 
     // submitted charge is the 'cost' 
     closureThis.claim.TotalCharge = cost.toString(); 
     // find how much is covered
     var coveredAmount = (cost * percent) / 100;
     // determine balance owed
     var balanceOwed = cost - coveredAmount;
     //
     closureThis.claim.BalanceOwed = balanceOwed.toString();
     closureThis.claim.CoveredAmount = coveredAmount.toString(); 
     //
     closureThis.claim['_csrf'] = tokenService.getToken();
 
    // Add the Claim.
    this.addClaim(); 

}


$scope.showDateOnScreen = function(value)  { 
   // format date on screen from database.
   // 2019-01-01 to 01012019. 
   // blank if y is 1753 or 1900.
   //
   // revised: its either 01/01/2020 or 'n/a' from hist display.
 //  console.log('showDate:input:' + value);
   
   if (value === 'n/a') {
       return ''; // blank out
   }
   // remove dashes.
   
   var yy = value.substring(6,10);

   if( yy === '1753' || yy === '1900') {
       // blank out default db dates!
       return ''; // blank out
   }


   var mm = value.substring(0,2);
   var dd = value.substring(3,5);
   var out = mm +  dd + yy;
  // console.log('showDateOnScreen:output:' + out);
   return out;
}


$scope.setAdjustingFields = function () {

    // set new claim values
    $scope.claim.AdjustmentDate = this.getCurrentDate();
    $scope.claim.AdjustedClaimId = this.adjustedId;
    $scope.claim.ClaimStatus = "Adjustment";

}

$scope.getListOfAllServices = function (ClaimType) {

    try {
 
 
        var url = appService.getAPIUrl();
        $http.get(url + 'readServices')
        .then(function(data,status,headers,config) {
 
            $scope.allServices = data.data;
          //  console.log($scope.allServices.length + ' services read')  
            $scope.filterServicesByClaimType(ClaimType); 
            return true;
  
            }, 
            function(data,status,headers,config) {
        
                    $scope.message = "service read fails. " +  status;
                    return false;
            });
        }
        catch(Error) {
            
            console.log('service read fails: ' + Error.message);
            return false; 
        }
        return false;

}

$scope.filterServicesByClaimType = function(PassedClaimType) {

    debugger; 
    // ie 11 
    // $scope.typeServices = $scope.allServices.filter(as => as['ClaimType'] == selectedClaimType);
    
    var out = 0;

    var firstEntry = null; // first for type
    var adjustmentEntry = null; // adjustment value 

    for(var i = 0 ; i < $scope.allServices.length; i++) {

        var row = $scope.allServices[i];
        var serviceTypeLit = row['ClaimTypeLiteral'].toString().trim();
        var serviceName = row['ServiceName'].toString().trim();

        if(serviceTypeLit !== PassedClaimType)
        {
            continue;
        } 
    
        // selection list service objects
        $scope.typeServices[out] = $scope.allServices[i];
        out++;
    

        // first type entry
        if(firstEntry === null) {

            firstEntry =  $scope.allServices[i]; 
        }

         // adjustment entry
      //   console.log('loop: serv=' + serviceName + ' adj-serv=' + $scope.adjustementServiceName);
         if(serviceName === $scope.adjustementServiceName) {

            adjustmentEntry =  $scope.allServices[i]; 
        } 
    }

    
  //  console.log($scope.typeServices.length + ' type services read') 
   
    // 1. For new claims put first service into the model  
    //    for service drop down
    // 2. for adjustments put the prior value in - saved in load adj fields routine.

    debugger;
 
    var empty = '';

    if($scope.adjustementServiceName === empty) {

        $scope.serviceEntryObject = firstEntry;

    } else { /* adjustment */ 
    
        $scope.serviceEntryObject = adjustmentEntry;
    
    } 

}
 

$scope.stampAdjustedClaim = function() {

    //stamp claim being adjusted ...
    var parm = {};
    parm.ClaimIdNumber = this.adjustedId; // claim being adjusted
    parm.AdjustedDate = $scope.claim.AdjustmentDate; 
    parm.AdjustmentIdNumber =  $scope.claim.ClaimIdNumber; // adjusting new claim 
    parm.AppAdjusting = "A40"; //2.24
    parm['_csrf'] = tokenService.getToken(); 


    try {
 
       var closureThis = this; 

       var url = appService.getAPIUrl();
       $http.put(url + 'stampAdjustedClaim/',parm)
       .then(function(data,status,headers,config) {

          debugger;
          
          // print success message and transfer  
          var a = closureThis.adjustedId.trim();
          var b = $scope.claim.ClaimIdNumber.trim();
          // ie 11 var message = `Claim ${a} adjusted by ${b}.`;
          var message = "Claim " + a + "  adjusted by " + b + ".";
          claimService.setPendingMessage(message); 
          // clear claim data in calaim service so that, next new claim
          // will have empty screen. 
          claimService.setClaim(null);
 

          // set focused claim    
          if(appService.usingFocus() && historyService.isFocusOn()) {  

                historyService.setFocusedClaimId(b);
          }
          
          

          setActionObject = { action: 'Adjustment', claimId: b }; 

          // set action for history if used 
          if(appService.usingActions()) { 
              
             historyService.setAction(setActionObject); 
          }
 
          // if stay button on and using stay go back to history.  
          if(appService.usingStay() && historyService.isStayOn())
          {
              $location.path('/history');
              return;
          } 

          $location.path('/hub');
 
    }, 
    function(data,status,headers,config) {
 
            $scope.message = "claim stamp fails. " +  status;
    });

}
catch(err)
{

 console.log("error encountered in claim stamp:" + err.message);

}

return; 

}

$scope.clearByType = function() {

    // clear fields not shown/keyed before submitting.
    if(!$scope.showMedical) {
        $scope.claim.DateConfine = '';
        $scope.claim.DateRelease = '';
    }
    if(!$scope.showDental) {
        $scope.claim.ToothNumber = ''; 
    }
    if(!$scope.showVision) {
        $scope.claim.Eyeware = '';
    }
    if(!$scope.showDrug) {
        $scope.claim.DrugName = '';
    }
}
 

$scope.claimType = function (claimType) {
 
    // buttons on screen set these fields.
    // called on init to set to medical.
    $scope.showMedical = (claimType === "Medical"); 
    $scope.showDental = (claimType === "Dental"); 
    $scope.showVision = (claimType === "Vision"); 
    $scope.showDrug = (claimType === "Drug");
    $scope.fileButton = "File " + claimType + " Claim";
    $scope.titleType = claimType; // show on title.

    var type = "u";
    switch(claimType) {
        case "Medical" :  type = "m" ; break;
        case "Dental"  :  type  = "d"; break;
        case "Vision"  :  type = "v" ; break;
        case "Drug" : type = "x" ; break;
        default:
            type = "u"; break;
    }
    $scope.selectedType = type; 
    $scope.filterServicesByClaimType(claimType);
    
    console.log($scope.typeServices.length + '(new type) claim controller -  type services found.');

}

$scope.getCurrentDate = function () {  
   var d = new Date();
   var today = (d.getMonth() + 1 ) + '/' + d.getDate() + '/' + d.getFullYear(); 
   return today; 
}

$scope.getClaimIdNumber = function () {

   var d = new Date();
   var today = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
   var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
   var id= 'CL-' + today + '-' + time; 
   return id;
}
 
$scope.editClaim = function () {
 
      $scope.message = '';
 
      var msg = []; 
      var concat = '';  

      var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
      var name2 = "^[a-zA-Z0-9.#\\s]+"; // city names   

      var pat1 = new RegExp(name1);
      var pat2 = new RegExp(name2);   

      $scope.message = ''; 
      var plan  =$scope.claim.PlanId;
      if(plan == null || plan == undefined || plan.trim().length == 0) {
       
          msg.push('Customer has no assigned plan - please select one.');
      } else {

          $scope.customerPlan = plan;
      }

      // insure no undefineds
      for(var property in $scope.claim) { 
         $scope.claim[property] = ($scope.claim[property] == null) ? '' : $scope.claim[property]; 
      }  

      if(!pat2.test($scope.claim.PatientFirst.trim())) { 
          msg.push('invalid patient first ' + $scope.claim.PatientFirst.trim()); 
      }

      if(!pat2.test($scope.claim.PatientLast.trim())) { 
          msg.push('invalid patient last ' + $scope.claim.PatientLast.trim()); 
      }
      if(!pat2.test($scope.claim.Physician.trim())) { 
          msg.push('invalid physician ' + $scope.claim.Physician.trim()); 
      }

      if(!pat2.test($scope.claim.Clinic.trim())) { 
          msg.push('invalid clinic' + $scope.claim.Clinic.trim()); 
      }

      if(!pat1.test($scope.claim.Procedure1.trim())) { 
          msg.push('invalid procedure ' + $scope.claim.Procedure1.trim()); 
      }

      if(!pat1.test($scope.claim.Diagnosis1.trim())) { 
          msg.push('invalid diagnosis ' + $scope.claim.Diagnosis1.trim()); 
      }

      if(!pat2.test($scope.claim.ClaimDescription.trim())) { 
          msg.push('invalid description ' + $scope.claim.ClaimDescription.trim()); 
      } 

      if($scope.claim.custPlan === "") {
        msg.push('Plan must be assigned before claim can be entered'); 
      }

     
    debugger;
     
       var dateParm = {
        screen: "claim",
        input: $scope.claim.DateService.trim(),
        valid: false,
        message: "",
        formatted: "",
        adjustment: $scope.adjustment
        }; 

    dateService.editDate(dateParm);

    if(!dateParm.valid) {
        
        msg.push('invalid service date' );
    }
    else {
     
        $scope.claim.DateService = dateParm.formatted;
    } 

       

       // only edit if medical claim
       // other types do not have edits
       if($scope.showMedical) { 

       

          if($scope.claim.DateConfine === "") {

              $scope.claim.DateConfine =  '01/01/1753';

          } else {  
              
                var dateParm = {
                    screen: "claim",
                    input: $scope.claim.DateConfine.trim(),
                    valid: false,
                    message: "",
                    formatted: "",
                    adjustment: $scope.adjustment
                }; 
            
                dateService.editDate(dateParm);
            
                if(!dateParm.valid) {
                    
                    msg.push('invalid confine date' );
                }
                else {
                
                    $scope.claim.DateConfine = dateParm.formatted;
                } 
            }

            if($scope.claim.DateRelease === "") {

                $scope.claim.DateRelease = '01/01/1753';

            } else {  

                var dateParm = {
                    screen: "claim",
                    input: $scope.claim.DateRelease.trim(),
                    valid: false,
                    message: "",
                    formatted: "",
                    adjustment: $scope.adjustment 
                }; 
            
                dateService.editDate(dateParm);
            
                if(!dateParm.valid) {
                    
                    msg.push('invalid release date' );
                }
                else {
                
                    $scope.claim.DateRelease = dateParm.formatted;
                } 
            }

        } // end med edits

       if($scope.showDental) {

            var tooth = $scope.claim.ToothNumber.trim();
            var toothNumber = parseInt(tooth);
            if(toothNumber === NaN) {
                msg.push('Invalid tooth number ' + $scope.claim.ToothNumber.trim()); 
            }
      
        } 
        if($scope.showVision) {

            if(!pat2.test($scope.claim.Eyeware.trim())) { 
                msg.push('Invalid eyeware name ' + $scope.claim.Eyeware.trim()); 
            }
      
        } 
        if($scope.showDrug) { 
            
            if(!pat2.test($scope.claim.DrugName.trim())) { 
                msg.push('Invalid drug name ' + $scope.claim.DrugName.trim()); 
            }
      
        } 
    
    
  

      $scope.message = "";
      var prefix = " *";

      if(msg.length === 0) {
          return true;
      }
 
 
      // fix ie11:
      debugger;
      for(i = 0; i < msg.length; i++) {

        var item = prefix + msg[i];
        //$scope.messages.push(item);
        $scope.message += item;
      } 
      
      return false; 

}
 

$scope.addClaim = function () {

      // testing undef  
       if($scope.claim.CoveredAmount == undefined) {
          $scope.claim.CoveredAmount = "0.0";
      }
      if($scope.claim.BalanceOwed == undefined) {
         $scope.claim.BalanceOwed = "0.0";
      }

      var closureThis = this;

      try {
 

         var url = appService.getAPIUrl();
         $http.post(url + 'addClaim/',$scope.claim)
         .then(function(data,status,headers,config) {

            // print success message and transfer 
            $scope.$parent.message = "Claim Submitted"; 
            
            // stamp claim adjusted if needed.
            if($scope.adjustment == true) {

                // timing - set message first here  or it is too late. 
                var a = $scope.claim.AdjustedClaimId.trim();
                var b = $scope.claim.ClaimIdNumber.trim();
                // ie 11 var message = `Claim ${a} adjusted by ${b}.`;
                var message = "Claim " + a + " adjudicated by " + b + ".";
                claimService.setPendingMessage(message);
                // stamp claim.
                closureThis.stampAdjustedClaim();
            }

            // route to update - will load cust from cust service. 
            // set claim added message for update if we have adjustment
            // message will be replaced for that. if adjustment stamp adj will set it.

            if($scope.adjustment === true) {

                return; 
            } 
             
            var a = $scope.claim.ClaimIdNumber;
            // ie 11 var message = `Claim ${a} has been filed.`;
            var message = "Claim " + a + " has been filed.";
            claimService.setPendingMessage(message); 

            // set focused claim    

            var claimId = a.trim();

            if(appService.usingFocus() && historyService.isFocusOn()) {  

               historyService.setFocusedClaimId(claimId); 
            } 

            setActionObject = { action: 'New', claimId: claimId }; 

            // set action for history if used 
            if(appService.usingActions()) { 
                
                historyService.setAction(setActionObject); 
            }

            // if stay button on and using stay go back to history.  
            if(appService.usingStay() && historyService.isStayOn())
            {
                $location.path('/history');
                return;
            } 

            $location.path('/hub');  

      }, 
      function(data,status,headers,config) {

      $scope.pass = false;    
      $scope.message = "claim add fails. " +  status;
      });

}
catch(err)
{
  
   console.log("error encountered in claim add:" + err.message);

}

return;
} 

}]);
