import express from 'express';
import UserController from './controllers/UserController';

const router = express.Router();

router.get('/user/:userId', UserController.getUser); 
router.get('/user/:userId/avatar', UserController.getAvatar); 
router.delete('/user/:userId/avatar', UserController.deleteAvatar);

export default router;



