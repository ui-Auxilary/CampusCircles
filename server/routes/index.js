import { Router } from "express";
import userRoute from "./user-route.js";
import eventRoute from "./event-route.js";

const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "Welcome!" });
});

indexRoute.use("/users", userRoute);
indexRoute.use("/events", eventRoute);

export default indexRoute;
