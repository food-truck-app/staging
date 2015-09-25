var mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/food_truck_app');
// mongoose.connect('mongodb://heroku_prt3tf2f:535sectp8nnkl10lbha2eric16@ds051953.mongolab.com:51953/heroku_prt3tf2f');
mongoose.connect('mongodb://heroku_4tdjdwk7:uvnenf6jv8n9n2er3s1jjrk80d@ds051883.mongolab.com:51883/heroku_4tdjdwk7');

var Truck = require(__dirname + '/../models/truck');
var fs = require('fs');

var filename = __dirname + '/database.json';

fs.readFile(filename, function(err, data) {
  if (err) return console.log(err);

  var fileJSON = JSON.parse(data);
  // console.log(fileJSON);

  for (var i = 0; i < fileJSON.length; i++) {
    var truck = fileJSON[i];
    var newTruck = new Truck(truck);
    newTruck.save(function(err, data) {
      if (err) return console.log(err);
      console.log(data);
    });
  }

  // mongoose.disconnect();
});
