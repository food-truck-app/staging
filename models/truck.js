var mongoose = require('mongoose');

var truckSchema = new mongoose.Schema({
  truckname: String,
  cuisine: String,
  description: String,
  menu: [{item: String}],
  locations: {
    monday: { name: String, loc: { type: [Number], index: '2d' } },
    tuesday: { name: String, loc: { type: [Number], index: '2d' } },
    wednesday: { name: String, loc: { type: [Number], index: '2d' } },
    thursday: { name: String, loc: { type: [Number], index: '2d' } },
    friday: { name: String, loc: { type: [Number], index: '2d' } },
    saturday: { name: String, loc: { type: [Number], index: '2d' } },
    sunday: { name: String, loc: { type: [Number], index: '2d' } },
  }
});

module.exports = mongoose.model('Truck', truckSchema);
