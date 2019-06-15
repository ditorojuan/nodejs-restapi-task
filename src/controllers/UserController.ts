import fetch from 'node-fetch';
import config from '../config';
import express from 'express';
import fs from 'fs';
import {
    create
} from '../../node_modules/@types/istanbul-reports';
import {
    resolve
} from 'path';

const BASE_URL = config.BASE_URL + '/users';
const FILE_DIRECTORY = config.FILE_DIRECTORY + '/img/';

export interface User {
    id: Number,
        email: String,
        first_name: String,
        last_name: String,
        avatar: String
}

async function getUserFromServer(userId: number) {
    const user = await fetch(BASE_URL + '/' + userId, {})
        .then((res) => res.json())
        .then((json) => json.data)
        .catch((err) => console.error(err));
    return user;
}

async function createFile(filePath: string, fileRes: any) {
    return new Promise((resolve, reject) => {
        let fileStream = fs.createWriteStream(filePath);
        fileRes.body.pipe(fileStream);
        fileRes.body.on('error', (err: Error) => {
            fileStream.close();
            reject(err);
        })
        fileRes.body.on('finish', async () => {
            fileStream.close();
            resolve();
        });
    });
}

async function readFile(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err)
            resolve(data.toString('base64'));
        });
    })
}

async function checkExistence(filePath: string) {
    if (!fs.existsSync(FILE_DIRECTORY)) fs.mkdirSync(FILE_DIRECTORY);
    return new Promise((resolve, reject) => {
        fs.exists(filePath, async (exist) => {
            resolve(exist)
        });
    }); 
}

class UserController {

    public static async deleteAvatar(req: express.Request, res: express.Response) {
        const id = req.params.userId;
        const filePath = FILE_DIRECTORY + '/' + id + '.jpeg';
        
        fs.exists(filePath, (exists) => {
            if(!exists) res.sendStatus(404);
            else{
                fs.unlink(filePath, (err)=> {
                    if(err) res.sendStatus(500);
                    else res.status(200).json({
                        message: 'File deleted correctly.'
                    });
                })
            }
        });
    } 

    public static async getAvatar(req: express.Request, res: express.Response) {
        const id = req.params.userId;
        const filePath = FILE_DIRECTORY + '/' + id + '.jpeg';
        const exist = await checkExistence(filePath);   
        if(!exist) {
            const user = await getUserFromServer(id);     
            const fileRes = await fetch(user.avatar, {});

            await createFile(filePath, fileRes);
        }

        const avatarBase64 = await readFile(filePath)
                                    .then((data) => `data:image/jpeg;base64,${data}`)
                                    .catch((err) => console.error(err));
        
        if (avatarBase64) {
            res.status(200).json({
                    avatar: avatarBase64
            });
        } else {
            res.status(500);
        }

    }

    public static async getUser(req: express.Request, res: express.Response) {
        const userId = req.params.userId;
        const user = await getUserFromServer(userId).catch((err) => console.error(err));

        return res.status(200).json(user);
    }
}

export default UserController;