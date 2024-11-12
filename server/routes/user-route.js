import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/user.js";

const userRoute = Router();

userRoute.get("", getUsers);
userRoute.get("/:id", getUser);
userRoute.post("", createUser);
userRoute.put("/:id", updateUser);
userRoute.post("/login", loginUser);

export default userRoute;
