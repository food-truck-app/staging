var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/food_truck_app');
process.env.APP_SECRET = process.env.APP_SECRET || 'forrealchangemechangeme';

app.use(bodyParser.urlencoded({
	extended: true
})); //allows objects and arrays to be encoded in a JSON like package

app.use(passport.initialize()); //requires the passport package

var userRouter = require(__dirname + '/routes/user');
var authRouter = require(__dirname + '/routes/auth');
var trucksRouter = require(__dirname + '/routes/trucks_routes');
var usersRouter = require(__dirname + '/routes/users_routes');
var webRouter = require(__dirname + '/routes/web_routes');
app.use('/api', trucksRouter);
app.use('/api', usersRouter);
app.use('/', webRouter);

var router = express.Router();

router.route('/users')
	.get(authRouter.isAuthenticated, userRouter.getUsers)
	.post(userRouter.postUsers);
// 
router.route('/authenticate')
	.post(userRouter.authenticateUser);

var trucksRouter = require(__dirname + '/routes/trucks_routes');
app.use('/api', trucksRouter);


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
