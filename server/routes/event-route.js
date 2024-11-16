import { Router } from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  getEventsToday,
} from "../controllers/event.js";

const eventRoute = Router();

eventRoute.get("/get", getEvents);
eventRoute.get("/get/today", getEventsToday);
eventRoute.get("/get/:id", getEvent);
eventRoute.post("/create", createEvent);

export default eventRoute;
