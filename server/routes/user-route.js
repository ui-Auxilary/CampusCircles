import { Router } from "express";
import {
  createUser,
  getUsers,
  loginUser,
  updateUser,
  getUserNotifs,
  getUserEvents,
} from "../controllers/user.js";

const userRoute = Router();

userRoute.get("", getUsers);
userRoute.post("", createUser);
userRoute.put("/:id", updateUser);
userRoute.post("/login", loginUser);
userRoute.get("/:id/notifications", getUserNotifs);
userRoute.get(":id/events", getUserEvents);

export default userRoute;
