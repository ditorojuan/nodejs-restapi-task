const mocha = require('mocha');
const expect = require('expect');
const fetch = require('node-fetch');
const fs = require('fs');

const UserController = require('../src/controllers/UserController');
const config = require('../config');

describe('UserController ', () => {
    it('should get user from userId', async () => {
        const userId = 2;
        let res = await UserController.getUser(userId);
        let expectedRes = await fetch('https://reqres.in/api/users/' + userId).then((res) => res.json());

        expect(res.id).toBe(userId);
        expect(res.avatar).toBe(expectedRes.avatar);
        expect(res.first_name).toBe(expectedRes.first_name);
    });

    it('should save avatar in fs', () => {
        let buffer = new Buffer();
        const fd = config.FILE_DIRECTORY + '/test.jpeg';
        fs.read(fd, buffer, 0, 100, null, (err, bytesRead, buffer) => {
                if(err) console.error('Error reading file ', err);
                console.log('File readed succesfully');
        });
        let UserController = new UserController();
        let res = await UserController.saveFile(fd);

        expect(res.buffer).toBe(buffer);

    })
});