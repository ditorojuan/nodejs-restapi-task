const mocha = require('mocha');
const expect = require('expect');
const chai = require('chai');

const app = require('../src/server');

describe('Run without problems', () => {
    it('should return true', () => {
        expect(true).toBeTruthy();
    })
});

describe('User Route', () => {
    it('should return user with id 2', (done) => {
        const id = 2;
        chai.request(app)
            .get('/' + id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    })
})