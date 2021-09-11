
// styleListService.js

app.service('styleListService', ['utilityService', function(utilityService) { 

        screenStyleList = [  
        { 
            screen : "",
            internalClass : "",
            externalClass : "",  
            userColor : "",
            headerColor : "",
            messageColor : "",
            labelColor : ""  
        }, 
        {

            screen : "",
            internalClass : "",
            externalClass : "",  
            userColor : "",
            headerColor : "",
            messageColor : "",
            labelColor : "" 
        
        }]; 

    defaultInternalClass = "Picture";
    defaultExternalClass = "bg-image";
    defaultUserColor = "white";
    defaultLabelColor = "dodgerblue";
    defaultHeaderColor = "goldenrod";
    defaultMessageColor = "goldenrod";

    // utility for debug purposes - dump list 

    this.showList = function() {

        for(var a of screenStyleList) 
            utilityService.showProperties(a);

    }

    this.findEmptyElement = function() {
    {
        var notFound = -1;
        var result = notFound;
        for(var i = 0 ; i < screenStyleList.length && result === notFound ; i++)

            if(screenStyleList[i].screen === "")
            { 
               result = i;
            }

            return result;
        }
    }

    this.findMatchingElement = function(screen) {
        {
            var notFound = -1;
            var result = notFound;
            for(var i = 0 ; i < screenStyleList.length && result === notFound ; i++)
    
                if(screenStyleList[i].screen === screen)
                { 
                   result = i;
                }
    
                return result;
            }
        }
    
    this.addScreenStyleObject = function(screenName) { 
 
       debugger;
       // find empty element 
       var i = this.findEmptyElement();
       with(screenStyleList[i]) {
       
            screen = screenName;
            internalClass = defaultInternalClass;
            externalClass = defaultExternalClass;
            userColor = defaultUserColor;
            headerColor = defaultHeaderColor;
            labelColor = defaultLabelColor;
            messageColor = defaultMessageColor; 
       }  
    }

    this.replaceScreenStyleObject = function( 
        _screen,
        _internalClass,
        _externalClass,
        _userColor,
        _headerColor,
        _messageColor,
        _labelColor) { 

       debugger;
         // find matching element 
       var i = this.findMatchingElement(_screen);
       with(screenStyleList[i]) {
       
            screen = _screen;
            internalClass = _internalClass;
            externalClass = _externalClass;
            userColor = _userColor;
            headerColor = _headerColor;
            labelColor = _labelColor;
            messageColor = _messageColor; 
       }  
    }

    this.getStyleObjectForScreen  = function(screenName) { 

        var foundObject = null;  
       // find matching element 
       var notFound = -1;
       var i = this.findMatchingElement(screenName);
       if(i > notFound) {
          foundObject = screenStyleList[i];
       } 
       return foundObject;
    }



    
}]);