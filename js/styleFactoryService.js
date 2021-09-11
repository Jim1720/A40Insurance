
// styleFactoryService.js 

app.service('styleFactoryService', ['styleListService', function(styleListService) {  

    
    userColors = [ "white", "red" , "pink","blue","aqua","yellow","green","lawngreen","gold","goldenrod"]; 
    // apply when solid
    labelColors = [ "black" , "white","red","white","blue","black","white","black","brown","brown"]; 
    // apply when solid
    headerColors = [ "black" , "white", "red","white","blue","black","white","black","brown","brown"]; 
    messageColors = [ "black" , "white", "red","white","blue","black","dodgerblue","black","black","black"];
 
    /* class lists */

   internalClasses = ["Style", "Picture", "Outline", "Solid"];
   externalClasses = ["bg-style","bg-image","bg-outline","bg-solid"];

   defaultUserColor = "white";
   defaultLabelColor = "dodgerblue";
   defaultHeaderColor = "burleywood";
   defaultMessageColor = "burleywood";
   defaultLabelColorForPictureStyle = "white";
   
   
   /* new style object default values */
   /* cycle 2 - picture */
 
 

    this.addNewStyleObject = function(screenName) {  
    
       
        debugger;
        styleListService.addScreenStyleObject(screenName); 
    } 

    this.getScreenStyleObject = function(screenName) {  
    
        var screenStyleObject = styleListService.getStyleObjectForScreen(screenName);
        return screenStyleObject;

    }  

    this.getNextStyle = function(screenName) {  
    
      
        var screenStyleObject = styleListService.getStyleObjectForScreen(screenName);
        var operation = ( screenStyleObject === null ) ? "New" : "Existing";
        if(operation === "New") {
       
            this.addNewStyleObject(screenName);
            return;

        }

        debugger;

        var max = internalClasses.length;
        var currentInternalClass = screenStyleObject.internalClass;
        for (var i = 0, match = false ;  match === false && i < max; i ++) { 

            // current screen style object interal class checked with
            // current internal class for styles
            // this is the main style driver.

            if(currentInternalClass === internalClasses[i]) {
            
                // match find next one.
                match = true;
                var endOfList = i === max - 1;
                var next = endOfList ? 0 : i + 1; 
                // next styles (clases external and internal)
                screenStyleObject.internalClass = internalClasses[next];
                screenStyleObject.externalClass = externalClasses[next];
                screenStyleObject.userColor = defaultUserColor; 
                // assign initial colors
                var first = 0;
                debugger;
                screenStyleObject.userColor = userColors[first];
                if (screenStyleObject.internalClass == "Solid") 
                {
                    screenStyleObject.headerColor = headerColors[first];
                    screenStyleObject.labelColor = labelColors[first];
                    screenStyleObject.messageColor = messageColors[first];
                }
                else if(screenStyleObject.internalClass == "Outline") 
                { 

                    screenStyleObject.headerColor = defaultHeaderColor;
                    screenStyleObject.labelColor = defaultLabelColor;
                    screenStyleObject.messageColor = defaultMessageColor;
                }
                else if(screenStyleObject.internalClass == "Picture")
                {
                    screenStyleObject.headerColor = defaultLabelColorForPictureStyle;
                    screenStyleObject.labelColor = defaultLabelColorForPictureStyle;
                    screenStyleObject.messageColor = defaultLabelColorForPictureStyle;
                }
                else
                {
                    // Style 
                    screenStyleObject.headerColor = defaultHeaderColor;
                    screenStyleObject.labelColor = defaultLabelColor;
                    screenStyleObject.messageColor = defaultMessageColor;
                }
                
                // update the objects style = internal and external classes.
                var _screen = screenStyleObject.screen;
                var _internalClass= screenStyleObject.internalClass;
                var _externalClass = screenStyleObject.externalClass;
                var _userColor = screenStyleObject.userColor;
                var _headerColor = screenStyleObject.headerColor;
                var _messageColor = screenStyleObject.messageColor;
                var _labelColor = screenStyleObject.labelColor;
                styleListService.replaceScreenStyleObject( 
                    _screen,
                    _internalClass,
                    _externalClass,
                    _userColor,
                    _headerColor,
                    _messageColor,
                    _labelColor); 
            } 
       }


    } 

    this.getNextColor = function(screenName) {   
        
        debugger;
        var screenStyleObject = styleListService.getStyleObjectForScreen(screenName); 
        var max = userColors.length;  
        for (var i = 0, match = false ; match === false &&  i < max ; i ++)
        { 

             if(screenStyleObject.userColor === userColors[i]) {

                match = true;
                // match find next one.
                var endOfList = i === max - 1;
                var next = endOfList ? 0 : i + 1;
                screenStyleObject.userColor = userColors[next];
                // apply when solid only....
                //alert(screenStyleObject.internalClass);
                debugger;
                if(screenStyleObject.internalClass === "Solid"
                    ||
                    screenStyleObject.internalClass === "Outline") { 

                    // colors for solid backgrounds 
                    screenStyleObject.headerColor = headerColors[next];
                    screenStyleObject.labelColor = labelColors[next];
                    screenStyleObject.messageColor = messageColors[next];

                }
                else
                { 
                     // defaults for outline picture and none. 

                    screenStyleObject.headerColor =
                           (screenStyleObject.internalClass == "Picture") ? 
                           defaultLabelColorForPictureStyle : defaultHeaderColor; // flexable.
                    screenStyleObject.labelColor = defaultLabelColor;
                    screenStyleObject.messageColor = defaultMessageColor;
                }
                //alert(screenStyleObject.userColor);

                 // update the objects color = internal and external classes.
                 var _screen = screenStyleObject.screen;
                 var _internalClass= screenStyleObject.internalClass;
                 var _externalClass = screenStyleObject.externalClass;
                 var _userColor = screenStyleObject.userColor;
                 var _headerColor = screenStyleObject.headerColor;
                 var _messageColor = screenStyleObject.messageColor;
                 var _labelColor = screenStyleObject.labelColor;
                 styleListService.replaceScreenStyleObject( 
                     _screen,
                     _internalClass,
                     _externalClass,
                     _userColor,
                     _headerColor,
                     _messageColor,
                     _labelColor); 

             }
         } 
    }

 

    this.getCurrentStyleForScreeen = function(screenName) {  
    
        var screenStyleObject = styleListService.getStyleObjectForScreen(screenName);
        return screenStyleObject;

    }  
    
}]);