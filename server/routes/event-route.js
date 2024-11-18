import { Router } from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  getEventsToday,
  updateEvent,
} from "../controllers/event.js";

const eventRoute = Router();

eventRoute.get("/get", getEvents);
eventRoute.get("/get/today", getEventsToday);
eventRoute.get("/get/:id", getEvent);
eventRoute.post("/create", createEvent);
eventRoute.put("/update/:id", updateEvent);

export default eventRoute;
