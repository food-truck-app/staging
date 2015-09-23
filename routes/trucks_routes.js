
var Truck = require(__dirname + '/../models/truck');
var express = require('express');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');

var trucksRoute = module.exports = exports = express.Router();

trucksRoute.get('/trucks', function(req, res) {
  Truck.find({}, function(err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});


trucksRoute.get('/trucks/:id', function(req, res) { // to get each truck data
  Truck.findById({_id: req.params.id}, function(err, data) {
    if (err) return handleError(err, res);
    res.json({truck});
  });
});

// trucksRoute.delete('/trucks/:id', jsonParser, function(req, res) {
//   Truck.remove({_id: req.params.id}, function(err) {
//     if (err) return handleError(err, res);
//     res.json({msg: 'success'});
//   });
// });
// trucksRoute.post('/trucks', jsonParser, function(req, res) {
//   var newTruck = new Truck(req.body);
//   newTruck.save(function(err, data) {
//     if (err) return handleError(err, res);
//     res.json(data);
//   });
// });
