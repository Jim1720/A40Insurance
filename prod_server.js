
// prod_server.js
//
//   p.port = process.env.port || 1337; // ms docs


var express = require('express');
 var app = express();

 console.log(" ");
 console.log(" prod server.js started. "); 

 app.use("/", express.static("./"));

 var port = procss.env.port || 1337

 app.listen(port);