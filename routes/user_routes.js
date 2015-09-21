var express = require('express');
var User = require(__dirname + '/../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var httpBasic = require(__dirname + '/../lib/http_basic');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var userRouter = module.exports = exports = express.Router();

userRouter.post('/signin', jsonParser, function(req, res) {
	var newUser = new User();
	newUser.basic.username = req.body.username;
	newUser.username = req.body.username;
	ee.emit('generateHash', newUser, req, res);
};

ee.on('generateHash', function(newUser, req, res) {
	newUser.generateHash(req.body.password, function(req, res) {
		if(err) return handleError(req, res);
		ee.emit('save', newUser, req, res);
	});
});

ee.on('save', function(newUser, req, res) {
	newUser.save(function(err, data) {
		if (err) return handleError(err, data);
		ee.emit('generateToken', newUser, req, res);
	});
});

ee.on('generateToken', function(newUser, req, res) {
	newUser.generateToken(function(err, token) {
		if (err) return handleError(err, res);
		res.json({token: token});
	});
});