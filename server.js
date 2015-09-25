var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URL || 'mongodb://heroku_prt3tf2f:535sectp8nnkl10lbha2eric16@ds051953.mongolab.com:51953/heroku_prt3tf2f');
process.env.APP_SECRET = process.env.APP_SECRET || 'b59bd6650d5bf1f14f38ad428a175c197802fde7f1be4f578d01b75a4f47d6f4d3d0d5e88fba2da40d68fb56041764f1';

var trucksRouter = require(__dirname + '/routes/trucks_routes');
var usersRouter = require(__dirname + '/routes/users_routes');
var webRouter = require(__dirname + '/routes/web_routes');
app.use('/api', trucksRouter);
app.use('/api', usersRouter);
app.use('/', webRouter);

var router = express.Router();

var trucksRouter = require(__dirname + '/routes/trucks_routes');
app.use('/api', trucksRouter);


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
