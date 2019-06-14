const fetch = require('node-fetch');
const config = require('../../config');

const BASE_URL = config.BASE_URL + '/user';

interface User {
    id: Number,
        email: String,
        first_name: String,
        last_name: String,
        avatar: String
}

class UserController {
    users: User[];

    constructor() {
        this.users = [];
    }

    saveAvatar() {

    }

    static async getUser(req, res) {
        const userId = req.params.userId;
        const user = fetch(BASE_URL + '/' + userId)
            .then((user) => user.json())
            .then((json) => json.data)
            .catch((err) => {
                return err;
            });

        return user;
    }
}

export default UserController;