import { Router } from "express";
import {
  sendInvitation,
  updateInvitationStatus,
  getInvitationsForEvent,
  unsendInvitation,
} from "../controllers/invite.js";

const invitationRoute = Router();

invitationRoute.post("/send", sendInvitation);
invitationRoute.post("/unsend", unsendInvitation);
invitationRoute.put("/update-status", updateInvitationStatus);
invitationRoute.get("/event/:eventId", getInvitationsForEvent);

export default invitationRoute;
