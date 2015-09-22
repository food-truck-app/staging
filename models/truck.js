var mongoose = require('mongoose');

var truckSchema = new mongoose.Schema({
  truckname: String,
  cuisine: String,
  description: String,
  menu: [{item: String}],
  locations: {
    monday: { lat: Number, lon: Number },
    tuesday: { lat: Number, lon: Number },
    wednesday: { lat: Number, lon: Number },
    thursday: { lat: Number, lon: Number },
    friday: { lat: Number, lon: Number },
    satday: { lat: Number, lon: Number },
    sunday: { lat: Number, lon: Number },
  }
});

module.exports = mongoose.model('Truck', truckSchema);
