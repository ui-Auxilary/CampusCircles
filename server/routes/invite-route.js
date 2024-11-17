import { Router } from "express";
import { acceptInvite, rejectInvite } from "../controllers.invite.js"; /////////// do this

const inviteRoute = Router();

eventRoute.put("/:id/accept", acceptInvite);
eventRoute.put("/:id/reject", rejectInvite);

export default inviteRoute;
