import express from 'express';

import router from './routes';

const app = express();


app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('Server up and Running');
});

export default app;