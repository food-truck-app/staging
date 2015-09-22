var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var userRouter = require(__dirname + './routes/user');
var authRouter = require(__dirname + './routes/auth');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/food_truck_app');

app.use(bodyParser.urlencoded({
	extended: true
})); //allows objects and arrays to be encoded in a JSON like package

app.use(passport.initialize()); //requires the passport package

var router = express.Router();

router.route('/users')
	.get(authRouter.isAuthenticated, userRouter.getUsers)
	.post(userRouter.postUsers);

router.route('/authenticate')
	.post(userRouter.authenticateUser);
		
var trucksRouter = require(__dirname + '/routes/routes');
app.use('/api', trucksRouter);


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});