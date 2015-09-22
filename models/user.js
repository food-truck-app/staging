var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');

//Lambda example
var userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
});

userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(8, function(err, salt) {
		if (err) return next(err);
		
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.verifyPassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);