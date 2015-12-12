'use strict'

const chai     = require('chai');
const should   = chai.should();
const chaiHttp = require('chai-http');
const server   = require('../server');

chai.use(chaiHttp);

describe('Open Weather API', () => {

  it('should get success on GET /weather/find', (done) => {
    chai.request(server)
      .get('/weather/find?location=40.572966,-74.331664')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.SUCCESS.should.be.true;
        done();
      });
  });

  it('should get weather information on GET /weather/find', (done) => {
    chai.request(server)
      .get('/weather/find?location=40.572966,-74.331664')
      .end((err, res) => {
        res.body.should.have.a.property('degrees');
        res.body.should.have.a.property('description');

        res.body.degrees.should.be.a('number');
        res.body.degrees.should.be.within(-150, 150);
        res.body.description.should.be.a('string');
        done();
      })
  });

  it('should fail when missing information on GET /weather/find', (done) => {
    chai.request(server)
      .get('/weather/find')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.SUCCESS.should.be.false;
        res.body.should.have.a.property('MESSAGE');
        res.body.MESSAGE.should.be.a('string');
        done();
      });
  });
});
