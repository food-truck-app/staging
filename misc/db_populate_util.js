var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/food_truck_app');

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
});
