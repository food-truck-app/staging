var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/food_truck_app_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Truck = require(__dirname + '/../models/truck');
var User  = require(__dirname + '/../models/user');

var token = '', test_id = '';
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

  it('should be able to create a truck document', function(done) {
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
      })
      .end(function(err, res) {
        test_id = res.body._id;
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.truckname).to.eql('Awesome Food Truck');
        done();
      });
  });

  it('should be able to update a truck document', function(done) {
    chai.request(server_url)
      .put('/trucks/' + test_id)
      .send({
        truckname: 'Bad Food Truck',
        cuisine: 'Burgers',
        description: 'An bad food truck!',
        menu: [{item: 'Cheese burger'}, {item: 'Fries'}],
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
      })
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should be able to get all truck documents', function(done) {
    chai.request(server_url)
      .get('/trucks')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should be able to get an individual truck document', function(done) {
    chai.request(server_url)
      .get('/trucks/' + test_id)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.truckname).to.eql('Bad Food Truck');
        expect(res.body.cuisine).to.eql('Burgers');
        done();
      });
  });

  it('should be able to delete a truck document', function(done) {
    chai.request(server_url)
      .delete('/trucks/' + test_id)
      .send({token: token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  describe('truck search', function() {
    before(function(done) {
      chai.request(server_url)
        .post('/trucks')
        .send({
          truckname: 'Awesome Food Truck',
          cuisine: 'Indian',
          description: 'An awesome food truck!',
          menu: [{item: 'Tikka Masala'}, {item: 'Naan'}],
          locations: {
            monday: {name: 'SLU', loc: [-122.37, 47.623553]},
            tuesday: {name: 'SLU', loc: [-122.37, 47.623553]},
            wednesday: {name: 'SLU', loc: [-122.37, 47.623553]},
            thursday: {name: 'SLU', loc: [-122.37, 47.623553]},
            friday: {name: 'SLU', loc: [-122.37, 47.623553]},
            saturday: {name: 'SLU', loc: [-122.37, 47.623553]},
            sunday: {name: 'SLU', loc: [-122.37, 47.623553]},
          },
          token: token
        })
        .end();
      chai.request(server_url)
        .post('/trucks')
        .send({
          truckname: 'Another Food Truck',
          cuisine: 'Mexican',
          description: 'A mexican food truck!',
          menu: [{item: 'Quesadilla'}, {item: 'Tacos'}],
          locations: {
            monday: {name: 'SLU', loc: [-122.39, 47.65]},
            tuesday: {name: 'SLU', loc: [-122.39, 47.65]},
            wednesday: {name: 'SLU', loc: [-122.39, 47.65]},
            thursday: {name: 'SLU', loc: [-122.39, 47.65]},
            friday: {name: 'SLU', loc: [-122.39, 47.65]},
            saturday: {name: 'SLU', loc: [-122.39, 47.65]},
            sunday: {name: 'SLU', loc: [-122.39, 47.65]},
          },
          token: token
        })
        .end();
      chai.request(server_url)
        .post('/trucks')
        .send({
          truckname: 'Chinese Food Truck',
          cuisine: 'Chinese',
          description: 'A chinese food truck!',
          menu: [{item: 'Chicken'}, {item: 'Steak'}],
          locations: {
            monday: {name: 'SLU', loc: [-122.37, 47.601]},
            tuesday: {name: 'SLU', loc: [-122.37, 47.601]},
            wednesday: {name: 'SLU', loc: [-122.37, 47.601]},
            thursday: {name: 'SLU', loc: [-122.37, 47.601]},
            friday: {name: 'SLU', loc: [-122.37, 47.601]},
            saturday: {name: 'SLU', loc: [-122.37, 47.601]},
            sunday: {name: 'SLU', loc: [-122.37, 47.601]},
          },
          token: token
        })
        .end(function(err, res) {
          done();
        });
    });

    it('should be able to search for nearby trucks', function(done) {
      var day_names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      var newDate = new Date();
      var day = day_names[newDate.getDay()];
      var coords = [-122.335827, 47.623553];
      chai.request(server_url)
        .get('/trucks/' + day + '/' + coords[0] + '/' + coords[1])
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });

    it('should be able to search by cuisine type', function(done) {
      var cuisine = 'Mexican';
      chai.request(server_url)
        .get('/trucks/cuisine/' + cuisine)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res.body[0].cuisine).to.eql(cuisine);
          done();
        });
    });
  });
});
