import { Router } from "express";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
  getUserFriends,
  getNonFriends,
  getUserNotifs,
  getUserEvents,
  addFriend,
  removeFriend,
  uploadProfile,
  deleteUser,
} from "../controllers/user.js";

const userRoute = Router();

userRoute.get("/get/:id", getUser);
userRoute.delete("/:id", deleteUser);
userRoute.post("/register", createUser);
userRoute.post("/upload/:id", uploadProfile);
userRoute.put("/:id", updateUser);
userRoute.post("/login", loginUser);
userRoute.get("/friends/:id", getUserFriends);
userRoute.get("/non-friends/:id", getNonFriends);
userRoute.post("/add-friend/:id", addFriend);
userRoute.post("/remove-friend/:id", removeFriend);
userRoute.get("/notifications/:id", getUserNotifs);
userRoute.get("/events/:id", getUserEvents);

export default userRoute;
