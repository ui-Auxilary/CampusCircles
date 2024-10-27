import { Router } from 'express';
import { createUser, getUsers } from '../controllers/user.js';

const userRoute = Router();

userRoute.get('', getUsers);
userRoute.post('', createUser);

export default userRoute;
