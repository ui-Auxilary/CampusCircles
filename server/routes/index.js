import { Router } from 'express';
import userRoute from './user-route.js';

const indexRoute = Router();

indexRoute.get('', async (req, res) => {
  res.json({ message: 'Welcome!' });
});

indexRoute.use('/users', userRoute);

export default indexRoute;
