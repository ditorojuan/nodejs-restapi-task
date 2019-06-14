import express from 'express';

import router from './api.routes';

const app = express();


app.use('/api' ,router);

app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('Server up and Running');
});

export default app;