import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/event.js';

const eventRoute = Router();

eventRoute.get('/get', getEvents);
eventRoute.post('/create', createEvent);

export default eventRoute;
