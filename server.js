var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/food_truck_app');
process.env.APP_SECRET = process.env.APP_SECRET || 'forrealchangemechangeme';

var trucksRouter = require(__dirname + '/routes/trucks_routes');
var usersRouter = require(__dirname + '/routes/users_routes');
app.use('/api', trucksRouter);
app.use('/api', usersRouter);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
