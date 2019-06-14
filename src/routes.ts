import express from 'express';
import UserController from './controllers/UserController';

const router = express.Router();
const BASE_ROUTE = '/api';

router.get(BASE_ROUTE + '/user/:userId', UserController.getUser); 

export default router;



