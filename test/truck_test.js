var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/food_truck_app_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Truck = require(__dirname + '/../models/truck');
var User  = require(__dirname + '/../models/user');

var token = '';
var server_url = 'localhost:3000/api';

describe('the truck resource', function() {
  before(function(done) {
    chai.request(server_url)
      .post('/signup')
      .send({username: 'test', password: 'foobar123'})
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;
      done();
    });
  });

  it('should be able to post truck documents', function(done) {
    chai.request(server_url)
      .post('/trucks')
      .send({
        truckname: 'Awesome Food Truck',
        cuisine: 'Indian',
        description: 'An awesome food truck!',
        menu: [{item: 'Tikka Masala'}, {item: 'Naan'}],
        locations: {
          monday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          tuesday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          wednesday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          thursday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          friday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          saturday: {name: 'SLU', loc: [-122.335827, 47.623553]},
          sunday: {name: 'SLU', loc: [-122.335827, 47.623553]},
        },
        token: token
      }).
      end(function(err, res) {
        debugger;
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });
});
