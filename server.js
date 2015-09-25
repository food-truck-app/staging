var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URL || 'mongodb://<dbuser>:<dbpassword>@ds051883.mongolab.com:51883/heroku_4tdjdwk7');
process.env.APP_SECRET = process.env.APP_SECRET || 'forrealchangemechangeme';

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
