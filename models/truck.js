var mongoose = require('mongoose');

var truckSchema = new mongoose.Schema({
  truckname: String,
  cuisine: String,
  menu: [{item: String}, {item: String}, {item: String}, {item: String}],
  location: String
});

module.exports = mongoose.model('FoodTruck', truckSchema);