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

  it('should get Place Info on /places/<type> GET', (done) => {
    chai.request(server)
      .get('/places/bar')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');

        res.body.SUCCESS.should.be.true;
        res.body.should.have.a.property('name');
        res.body.should.have.a.property('address');
        res.body.should.have.a.property('open_now');
        res.body.should.have.a.property('rating');
        res.body.should.have.a.property('price_level');
        res.body.should.have.a.property('picture_ref');
        res.body.should.have.a.property('link');

        res.body.name.should.be.a('string');
        res.body.address.should.be.a('string');
        res.body.picture_ref.should.be.a('string');
        res.body.link.should.be.a('string');

        done();
      });
  });

});
