var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/food_truck_app_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var User = require(__dirname + '/../models/user');
var eatAuth = require(__dirname + '/../lib/eat_auth');
var httpBasic = require(__dirname + '/../lib/http_basic');

describe('httpBasic', function() {
	it('should be able to parse auth data', function() {
		var req = {
			headers: {
				authorization: 'Basic ' + (new Buffer('hungryClare:lovesBLTs')).toString('base64') //user hungryClare pass= lovesBLTS
			}
		};

		httpBasic(req, {}, function() {
			expect(typeof req.auth).to.eql('object');
			expect(req.auth.username).to.eql('hungryClare');
			expect(req.auth.password).to.eql('lovesBLTs');
		});
	});
});

describe('authorization', function() {
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should be able to create new user', function() {
		chai.request('localhost:3000/api')
			.post('/signup') //need to build these routes (and line 66)
			.send({username: 'hungryClare', password: 'lovesBLTs'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				console.log('req',req)
				expect(req.body.token).to.have.length.above(0);
				done();
			});
	});
});

describe('should be able to find a member already in user database', function() {
	before(function(done) {
		var user = new User();
		user.username = 'hungryClare';
		user.basic.username = 'hungryClare';
		user.generateHash('lovesBLTs', function(err, res) {
			if (err) return err;
			user.save(function(err, data) {
				if (err) return err;
				user.generateToken(function(err, token) {
					this.token = token;
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	it('should be able to sign in', function(done) {
		chai.request('localhost:3000/api')
			.get('/signin')
			.auth('hungryClare', 'lovesBLTs')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.token).to.have.length.above(0);
				done();
			});
	});

	it('should be able to authenticate token', function(done) {
		var token = this.token;
		var req = {
			headers: {
				token: token
			}
		};

		eatAuth(req, {}, function() {
			expect(req.user.username).to.eql('hungryClare');
			done();
		});
	});
});




















