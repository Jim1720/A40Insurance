
// utlity.js
 

app.service('utilityService', function() { 

    this.replaceProperty = function(object, propertyToChange , newPropertyValue)   {

        // replaces one property in the object and return object.
        debugger;
        for(var property in object) {

            if(property === propertyToChange) {
                object[property] = newPropertyValue;
            }
        }

        return object;
    }

    this.showProperties = function(object) {

      
        for(var property in object) {
            console.log(property.toString() + ':' + object[property]);
        }
    }

    this.makeDistinctNewObject = function(from) {
    
        debugger;
        var newObject = Object.create(from);

        
        for(var property in from) {
            newObject[property] = from[property];
        }

        return newObject;
    }

    this.trimFields = function(object) {
         
        for(var property in object) {
             
            var p = object[property];
            if(p === undefined || p === null) 
              continue;
            object[property] = p.toString().trim();
        }

    } 
});
