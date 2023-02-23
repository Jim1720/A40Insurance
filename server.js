
 var express = require('express');
 var app = express();

 console.log(" ");
 console.log(" server.js started. "); 

 app.use("/", express.static("./"));
 app.listen(80);