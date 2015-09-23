
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

trucksRoute.get('/trucks/:id', function(req, res) {
  Truck.findById(req.params.id, function(err, truck) {
    if (err) return handleError(err, res);
    res.json(truck);
  });
});

trucksRoute.get('/trucks/:cuisine', function(req, res) {
  var cuisine = req.params.cuisine;
  Truck.find(cuisine, function(err, trucks) {
    if (err) return handleError(err, res);
    res.json(trucks);
  });
});

trucksRoute.get('/trucks/:day/:lng/:lat', function(req, res) {
  var query = {};
  query['locations.' + req.params.day + '.loc'] = {$near: [req.params.lng, req.params.lat]};
  Truck.find(query).limit(5).exec(function(err, trucks) {
    if (err) return handleError(err, res);
    res.json(trucks);
  });
});

trucksRoute.post('/trucks', jsonParser, function(req, res) {
  var newTruck = new Truck(req.body);
  newTruck.save(function(err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

trucksRoute.put('/trucks/:id', jsonParser, function(req, res) {
  var newTruckBody = req.body;
  Truck.update({_id: req.params.id}, newTruckBody, function(err, data) {
    if (err) return handleError(err, res);
    res.json({msg: 'success'});
  });
});

trucksRoute.delete('/trucks/:id', jsonParser, function(req, res) {
  Truck.remove({_id: req.params.id}, function(err) {
    if (err) return handleError(err, res);
    res.json({msg: 'success'});
  });
});
