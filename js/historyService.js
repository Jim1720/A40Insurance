
// historyService.js

/* handles focus and action functions */ 

app.service('historyService', function() {

     // history stay and focus services

    _historyFocusOn = false;
    _historyStayOn = false; 

    _focusedClaimId = ""; 

    this.toggleStay = function() {
        var newValue =  _historyStayOn ? false : true;
        _historyStayOn = newValue;
        var newLiteral = newValue ? "stay on" : "stay off";
        return newLiteral;
    }

    this.isStayOn = function() {
        
        return _historyStayOn;
    }

    this.toggleFocus = function() {
        var newValue = _historyFocusOn ? false : true;
        _historyFocusOn = newValue; 
        var newLiteral = newValue ? "focus on" : "focus off";
        return newLiteral;
    }

    this.isFocusOn = function() {

        return _historyFocusOn;
    }

    this.isFocusedClaimSet = function() {

         return _focusedClaimId != "";
    }

    this.setFocusedClaimId = function(focusedClaimId) {

        _focusedClaimId = focusedClaimId;
    }

    this.getFocusedClaimId = function() {

        return _focusedClaimId;

    }

  

    // action services 

    // actionList format:
    //
    // setActionObject = { action: '', claimId: '' };
    // 
    
    actionObjectReturned = { actionLit: '', claimId: '' }; 

    actionList = [];
    
    this.setAction = function(setActionObject) {  

        var length = actionList.length;
        switch(length)
        {
            case 0: actionList.push(setActionObject); break;
            case 1: actionList.push(setActionObject); break;
            case 2: actionList.shift(); actionList.push(setActionObject); break;
            default: break;
        } 
    }

    this.getAction = function(getActionObject) {  

        //  parm:  index - lookup; result found data = true...

        // getActionObject = { index: 0, actionLit: '' , claimId: '', data: false }  

        var found = true;
        var nothing = null;

        var count = actionList.length;
        var index = getActionObject.index;
        if(index >= count) {
            found = false;
            return { found , nothing, nothing }
        }

        getActionObject.data = true; 
  
        var actionEntry = actionList[index];
        var action = actionEntry['action'];
        var claimId = actionEntry['claimId'];
        

        // format literal like Adj-22 or Pay-23 etc.
        var act = action.substring(0,3);
        var dash = "-";
        var start = claimId.length - 2;
        var cl =  claimId.substring(start);
        cl = cl.replace(":",""); 
        var literal = act + dash + cl; 
        var actionLit = literal;  

        found = true;

       return { found ,actionLit, claimId}; 

    } 
  

});