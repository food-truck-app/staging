var User = require(__dirname + '/../models/user');

//accesses users in database
exports.getUsers = function(req, res) {
	User.find(function(err, users) {
		if(err) res.send(err);
		res.json(users);
 	});
};

//makes new user
exports.postUsers = function(req, res){
	if(!req.body.username || !req.body.password) {
		res.json({msg: 'Error processing request'});
		return;
	}
	var user = new User( {
		username: req.body.username,
		password: req.body.password
	});

	user.save(function(err) {
		if(err) {
			res.json({msg: 'Username already exists'});
			return;
		};
		res.json({msg: 'new user added'});
	});
};

//authenticates a user based on database info
exports.authenticateUser = function(req, res) {
	if(!req.body.username || !req.body.password) {
		res.json({msg: 'Error processing request'});
		return;
	};
	User.findOne({username: req.body.username}, function(err, user) {
		if(!user) {
			res.json({msg: 'Username does not exist'});
			return;
		}
		user.verifyPassword(req.body.password, function(err, isMatch) {
			if(err) {
				res.json({msg: err});
				return;
			} else if(!isMatch) {
				res.json({msg: 'Incorrect password'});
			} else {
				res.json({'successful login'});
			}
		});
	});
}