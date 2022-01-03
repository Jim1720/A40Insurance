

// dateService.js 

// replaces dateEditService.js  3.31.20

app.service('dateService', function() {

     currentYear = 0;
     currentCentury = 0;
     currentYear2Digits = 0; 
   
    this.editDate = function (dateParm) {
   

      // screen is 'claim' etc and will determine the year range that is if claim
      // date can be +/- 1 year. if 'register','update' date can be -90 years or now for
      // birth date or 1 month in future for medicare. 
 
      this.setUp();

         // edit screen
         var validScreen  = dateParm.screen === "register" || dateParm.screen === "update" 
                          || dateParm.screen === "claim";
        if(!validScreen) { 

            dateParm.message = "invalid screen type.";
            dateParm.valid = false; 
        }


        // remove slashes
        var regularDate = this.intakeSlashes(dateParm.input); 

       /* ie 11 */
        var r = parseInt(dateParm.input); 
        if(r === NaN) {
       /*  if(Number.isNaN(r)) ie 11. { */
            dateParm.valid = false;
            dateParm.message = "Date not numeric.";
            return;
        }  
    

        var mm = regularDate.substring(0,2);
        var dd = regularDate.substring(2,4);
        var yy = regularDate.substring(4); 
      
        if(!this.editMonth(mm)) {
             dateParm.valid = false;
             dateParm.message = "date month invalid";
             return;
        }
  
        if(!this.editYear(yy,dateParm.screen,dateParm.adjustment)) {
             dateParm.valid = false;
             dateParm.message = "date year invalid";
             return;
        }
  
        if(!this.editDay(dd, mm, yy)) {
              dateParm.valid = false;
              dateParm.message = "date day invalid";
              return;
        }

        const needCenturyAddded = 2;
        if(yy.length === needCenturyAddded) { 
           var century= this.addCentury(yy);
           yy = century + yy;
        }
       
        var slash = "/";
        var formattedDate = mm + slash + dd + slash + yy;  
  
        dateParm.valid = true;
        dateParm.formatted = formattedDate;
        return; 

    }

    this.setUp = function()
    {  
       // current dates...
       let d = new Date();
       this.currentYear = d.getFullYear();
       this.currentYear2Digits = parseInt(this.currentYear.toString().substring(2,4)); 
    }

    this.addCentury = function(y2Digits)  
    {

      // TODO: det impact on lciam dates timing of prior edits... 
      // we need to add century
      let  inputYear  = parseInt(y2Digits); 
      let  nextYear = this.currentYear2Digits + 1; 
      let  useCentury = (inputYear > nextYear) ? "19" : "20";
      return useCentury;

    }

    this.intakeSlashes = function(dateToEdit) 
    {
        // allow for dates like
        // 1/1/20:  
        // rules. find 2 slashes
        // pad m,d with 0 if good rules
        // remove slashes leave year untouched
        // if fail rules just return origional value.

        // example: 1/1/20 gives 010120

        var slash = "/";
        var dateItems   = dateToEdit.split(slash);
        var haveEnoughItems = 3;
        if(dateItems.length < haveEnoughItems) {
            // no dashes or too few terms in date ; return date.
            return dateToEdit;
        }

        // m d y are in the dateItems array. pad m, d if needed...
        if (dateItems[0].length === 1) { dateItems[0] = "0" + dateItems[0] }; // pad m if 1 digit
        if (dateItems[1].length === 1) { dateItems[1] = "0" + dateItems[1] }; // pad d if 1 digit

        // do nothing with the year 

        // return mmdd(year) without slashes.

        return dateItems[0] + dateItems[1] + dateItems[2];

    }

    this.editMonth = function(mm)  {
        var month = parseInt(mm);
        var monthValid = month >= 1 && month <= 12;
        return monthValid;
    }

    this.editDay = function(dd, mm, yy)  {
       
        var thirtyMonth = [4,6,9,11]; 
        var day = parseInt(dd);
        var month = parseInt(mm);
        var year = parseInt(yy);
        const feburary = 2;
 
        var dayLimit = 31;
        if(thirtyMonth.indexOf(month) > -1) {
            dayLimit = 30;
        }
        if(month === feburary) {
    
            dayLimit = (year % 4 === 0) ? 29 : 28;
        }
        var dayValid = (day > 0 && day <= dayLimit); 
        return dayValid;
    }

    this.editYear = function(yy,fromScreen,adjustment)  {

        var year = parseInt(yy);
        // reasonable check only.
        var len = yy.length;
        var validLength = len === 2 || len === 4;
        if(!validLength) { return false; }
        const centuryOmitted = 2;

        var adjustmentYearRange = 0;
        var allowedAdjustmentYearrange = 5;
        if(adjustment === true) {
            // what is this:
            // allow for adjusted claims to be within 5 years so
            // service, confine and release dates pass edits.
            adjustmentYearRange = allowedAdjustmentYearrange; // rel 3 date fix
        }


        if(len === centuryOmitted) {

            // registration can be any year since it is birth date
            // claim dates can be +1/-1 current year only
            // correspond with screen input...
            var currentYear = this.currentYear; // rel 3 date fix
            var lastYear = currentYear - 1; // rel 3 date fix
            var nextYear = currentYear + 1; // rel 3 date fix
            lastYear -= adjustmentYearRange; // rel 3 date fix
            var convertBackTo4Digits = 2000;
            year += convertBackTo4Digits;
            if(fromScreen === "claim" && (year < lastYear || year > nextYear)) // rel 3 date fix
            {
              return false;
            }
            return true;

        }
        
        const dateIncludesCentury = 4;
        if(len === dateIncludesCentury) {

            const earlyLimit = 1900;
            var currentYear = this.currentYear;
            var lastYear = currentYear - 1;
            var nextYear = currentYear + 1;
            lastYear -= adjustmentYearRange; // rel 3 date fix
            // procedure dates
            if(fromScreen === "claim" && (year < lastYear || year > nextYear))
            { 
               return false;
            } 
            // birth date
            if((fromScreen === "register" || fromScreen === "update")
               && (year < earlyLimit || year > currentYear)) 
            { 
               return false; 
            }
            return true; 
        } 

    }

});

