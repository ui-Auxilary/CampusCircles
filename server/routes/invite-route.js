import { Router } from "express";
import { acceptInvite, rejectInvite } from "../controllers/invite.js"; // Correct path and file name

const inviteRoute = Router();

inviteRoute.put("/:id/accept", acceptInvite);
inviteRoute.put("/:id/reject", rejectInvite);

export default inviteRoute;
