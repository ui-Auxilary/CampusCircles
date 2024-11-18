import { Router } from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  getEventsToday,
  updateEvent,
  joinEvent,
  leaveEvent,
} from "../controllers/event.js";

const eventRoute = Router();

eventRoute.get("/get", getEvents);
eventRoute.get("/get/today", getEventsToday);
eventRoute.get("/get/:id", getEvent);
eventRoute.post("/create", createEvent);
eventRoute.put("/update/:id", updateEvent);
eventRoute.post("/join", joinEvent);
eventRoute.post("/leave", leaveEvent);

export default eventRoute;
