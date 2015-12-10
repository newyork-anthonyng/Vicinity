'use strict'

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../server');

const should   = chai.should();

chai.use(chaiHttp);

describe('Google Places API', () => {
  it('test route', (done) => {
    chai.request(server)
      .get('/places/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.SUCCESS.should.be.true;
        done();
      });
  });

  it('should get a Place on /places/<type> GET', (done) => {
    chai.request(server)
      .get('/places/bar')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.SUCCESS.should.be.true;
        res.body.RESULT.should.have.a.property('name');
        res.body.RESULT.name.should.be.a('string');

        res.body.RESULT.should.have.a.property('address');
        res.body.RESULT.address.should.be.a('string');

        res.body.RESULT.should.have.a.property('open_now');
        res.body.RESULT.open_now.should.be.a('boolean');

        res.body.RESULT.should.have.a.property('ratings');
        res.body.RESULT.ratings.should.be.a('integer');
        res.body.RESULT.ratings.should.be.within(1, 5);

        res.body.RESULT.should.have.a.property('price_level');
        res.body.RESULT.price_level.should.be.a('integer');
        res.body.RESULT.price_level.should.be.within(0, 4);
        done();
      });
  });

});
