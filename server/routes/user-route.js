import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  loginUser,
  updateUser,
  getUserFriends,
  getNonFriends,
  getUserNotifs,
  getUserEvents,
  addFriend,
} from '../controllers/user.js';

const userRoute = Router();

userRoute.get('', getUsers);
userRoute.get('/:id', getUser);
userRoute.post('', createUser);
userRoute.put('/:id', updateUser);
userRoute.post('/login', loginUser);
userRoute.get('/:id/friends', getUserFriends);
userRoute.get('/:id/non-friends', getNonFriends);
userRoute.post('/:id/add-friend', addFriend);
userRoute.get("/:id/notifications", getUserNotifs);
userRoute.get(":id/events", getUserEvents);
} from "../controllers/user.js";

export default userRoute;
