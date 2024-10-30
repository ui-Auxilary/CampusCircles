import { Router } from 'express';
import { createUser, getUsers, loginUser } from '../controllers/user.js';

const userRoute = Router();

userRoute.get('', getUsers);
userRoute.post('', createUser);
userRoute.post('/login', loginUser);

export default userRoute;
