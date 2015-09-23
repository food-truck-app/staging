var express = require('express');
var User = require(__dirname + '/../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var httpBasic = require(__dirname + '/../lib/http_basic');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var userRouter = module.exports = exports = express.Router();

userRouter.post('/signup', jsonParser, function(req, res) {
  var newUser = new User();
  newUser.username = req.body.username;
  ee.emit('generateHash', newUser, req, res);
});

ee.on('generateHash', function(newUser, req, res) {
  newUser.generateHash(req.body.password, function(err, hash) {
    if (err) return handleError(err, res);
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

userRouter.get('/signin', httpBasic, function(req, res) {
  User.findOne({'username': req.auth.username}, function(err, user) {
    if (err) return handleError(err, res);
    if (!user) {
      console.log('could not authenticate');
      return res.status(401).json({msg: 'could not authenticate inside findOne(username)'});
    }
    ee.emit('compareHashRoute', req, res, user);
  });
});

ee.on('compareHashRoute', function(req, res, user) {
  user.compareHash(req.auth.password, function(err, hashRes) {
    if (err) return handleError(err, res);
    if (!hashRes) {
      return res.status(401).json({msg: 'could not authenticate'});
    }
    ee.emit('generateTokenRoute', req, res, user);
  });
});

ee.on('generateTokenRoute', function(req, res, user) {
  user.generateToken(function(err, token) {
    if (err) return handleError(err, res);
    return res.json({token: token});
  });
});
