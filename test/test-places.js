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

  it('should get JSON with place-info on /places/<type> GET', (done) => {
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
        res.body.should.have.a.property('latitude');
        res.body.should.have.a.property('longitude');

        res.body.name.should.be.a('string');
        res.body.address.should.be.a('string');
        res.body.picture_ref.should.be.a('string');
        res.body.link.should.be.a('string');
        res.body.latitude.should.be.a('number');
        res.body.longitude.should.be.a('number');

        if(res.body.open_now != 'not shown') {
          res.body.open_now.should.be.a('boolean');
        }

        if(res.body.price_level != 'not shown') {
          res.body.price_level.should.be.within(0, 4);
        }

        if(res.body.rating != 'not shown') {
          res.body.rating.should.be.within(1, 5);
        }

        done();
      });
  });
});
