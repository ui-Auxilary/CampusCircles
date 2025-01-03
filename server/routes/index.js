import { Router } from "express";
import userRoute from "./user-route.js";
import OAuthRoute from "./oauth-route.js";
import eventRoute from "./event-route.js";
import invitationRoute from "./invite-route.js";

const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "Welcome!" });
});

indexRoute.use("/events", eventRoute);
indexRoute.use("/invitations", invitationRoute);
indexRoute.use("/users", userRoute);
indexRoute.use("/swg", OAuthRoute);

export default indexRoute;
