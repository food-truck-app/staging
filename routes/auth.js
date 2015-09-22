var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy; //could change if we want
var User = require(__dirname + '/../models/user');

passport.use(new BasicStrategy(
	function(username, password, next) {
		User.findOne({username: username}, function(err, user) {
			if (err) {return next(err);}
			if(!user) {return next(null, false);}

			user.verifyPassword(password, function(err, isMatch) {
				if(err) {return next(err);}
				if(!isMatch) {return next(null, false);}
				return next(null, user);
			});
		});
	}
));

exports.isAuthenticated = passport.authenticate('basic', {session: true});
//session: true stores user login