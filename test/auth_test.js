var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/food_truck_app_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var User = require(__dirname + '/../models/user');
var eatAuth = require(__dirname + '/../lib/eat_auth');
var httpBasic = require(__dirname + '/../lib/http_basic');

describe('httpBasic', function() {
	it('should be abe to parse an http basic auth request', function() {
		var req =  {
			headers: {
				authorization: 'Basic ' + (new Buffer('test:foobar123')).toString('base64')
			}
		};

		httpBasic(req, {}, function() {
			expect(typeof req.auth).to.eql('object');
			expect(req.auth.username).to.eql('test');
			expect(req.auth.password).to.eql('foobar123');
		});
	});
});

describe('auth', function() {
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should be able to create a new user', function(done) {
		chai.request('localhost:3000/api')
			.post('/signup')
			.send({username: 'test1', password: 'foobar456'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.token).to.have.length.above(0); //still undefined
				done();
			});
	});
});

describe('should be able to look up a user in database', function() {
	before(function(done) {
		var user = new User();
		user.username = 'test2';
		user.generateHash('foobar789', function(err, res) {
			if(err) throw err;
			user.save(function(err, data) {
				if(err) throw err;
				user.generateToken(function(err, token) {
					if(err) throw err;
					this.token = token;
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	it('should be able to sign in', function(done) {
		chai.request('localhost:3000/api')
			.get('/signin')
			.auth('test2', 'foobar789')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.token).to.have.length.above(0); //cant find length of undefined
				done();
			});
	});

	it('should deny a username that is already in database', function(done) {
		chai.request('localhost:3000/api')
			.get('/signin')
			.auth('test2', 'barfoo')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.eql({msg: 'could not authenticate'});
				done();
			})	
	})

	it('should be able to authenticate with eat auth', function(done) {
		var token = this.token;
		var req = {
			headers: {
				token: token
			}
		};

		eatAuth(req, {}, function() {
			expect(req.user.username).to.eql('test2');
			done();
		});
	});


});




















