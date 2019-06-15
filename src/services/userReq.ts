import fetch from 'node-fetch';
import fs from 'fs';


import {User} from '../controllers/UserController'
import config from '../config';

const appendToFileService = async (pageToAppend: Object[] | User[] ) => {
    return new Promise((resolve, reject) => {

        let currentJson: any = {
            users: []
        };
        const filePath = config.FILE_DIRECTORY + '/user_pages.json';

        fs.exists(filePath, (exist) => {
            if(exist) {
                let data = fs.readFileSync(filePath);
                currentJson = JSON.parse(data.toString());
                for (const user in pageToAppend) {
                    currentJson.users.push(pageToAppend[user]);
                }
            } else{
                currentJson.users = pageToAppend;
            }
            let dataToFile = JSON.stringify(currentJson);
            console.log(currentJson);
            if(dataToFile != undefined) fs.writeFileSync(filePath, dataToFile);
        });

    });
}

const reqPageService = (page: any) => {
    return new Promise<User[]>(async (resolve, reject) => {
        const userPage: User[] = await fetch(`https://reqres.in/api/users?page=${page}`, {})
                                .then((data) => data.json())
                                .then((json) => json.data)
                                .catch((err) => reject(err));
        
        console.log(userPage);
        resolve(userPage);
    });

}

const countUp = (function () {
        let counter = 1;

        return (stop: boolean) => {
            return !stop ? 0 : counter++;
    }})();


export {
    countUp,
    appendToFileService,
    reqPageService
}