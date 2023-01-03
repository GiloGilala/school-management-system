import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  subscribe,
  unsubscribe,
  like,
  dislike,
  createProfilePic,
  deleteProfilePic,
  getProfilePic,
} from "../controllers/user.js";

import { isAuthUser } from "../../../utils/verifyToken.js";
import { upload } from "../../../middleware/multer.js";

const router = express.Router();

//CREATE
router.post("/me/pic", isAuthUser, upload.single("file"), createProfilePic);

//DELETE
router.delete("/me/pic", isAuthUser, upload.single("file"), deleteProfilePic);

//GET
router.get("/me/pic", isAuthUser, getProfilePic);

//DELETE
router.delete("/:id", isAuthUser, deleteUser);

//GET
router.get("/find/:id", isAuthUser, getUser);

//GET ALL
router.get("/", getUsers);

//subscribe a user
router.put("/sub/:id", isAuthUser, subscribe);

//unsubscribe a user
router.put("/unsub/:id", isAuthUser, unsubscribe);

//like a video
router.put("/like/:videoId", isAuthUser, like);

//dislike a video
router.put("/dislike/:videoId", isAuthUser, dislike);
export default router;
