// const mocha = require('mocha');
// const expect = require('expect');
// const chai = require('chai');


import expect from 'expect';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiFile from 'chai-files';

import app from '../src/server'

chai.use(chaiHttp);
chai.use(chaiFile);
chai.should();

let file = chaiFile.file;
let dir = chaiFile.dir;

const URL = '/api'

describe('Run without problems', () => {
    it('should return true', () => {
        expect(true).toBeTruthy();
    })
});

describe('User Route', () => {

    it('should return user with id 2', (done) => {
        const id = 2;
        chai.request(app)
            .get(URL +'/user/' + id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    })

    it('should save image to fileSystem ', (done) => {
        const id = 2;
        chai.request(app)
            .get(URL +'/user/' + id + '/avatar')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(file('./files/'+id+'.jpeg')).toBeDefined();
                expect(res.body.avatar).toBeDefined();
                done();
            });
    })

    it('should answer without calling api to fileSystem (<10ms) ', (done) => {
        const id = 2;
        const initTime = Date.now();
        chai.request(app)
            .get(URL +'/user/' + id + '/avatar')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(file('./files/'+id+'.jpeg')).toBeDefined();
                expect(res.body.avatar).toBeDefined();
                const latency = Date.now() - initTime;
                expect(latency).toBeLessThan(10);
                done();
            });
    })

    it('should delete image in fileSystem ', (done) => {
        const id = 2;
        chai.request(app)
            .delete(URL +'/user/' + id + '/avatar')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(file('./files/'+id+'.jpeg')._exists).toBe(null);
                done();
            });
    })
})