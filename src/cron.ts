import cron from 'node-cron';

import {appendToFileService, reqPageService, countUp} from './services/userReq';
import {User} from './controllers/UserController';
import { NullConsole } from '../node_modules/@jest/console';

let cronJob = cron.schedule('* 1 * * * *', async () => {
    let counter: any = countUp(true);
    let data: User[] = await reqPageService(counter);
    if(data[0] != null) await appendToFileService(data);
    else {
        console.log('No more data to fetch!');
        countUp(false);
        process.exit();
    }
});