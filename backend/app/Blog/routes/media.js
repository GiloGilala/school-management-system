import express from "express";
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMediaPerPage,
  getSearchMedia,
  getUserMedia,
  updateMedia,
} from "../controllers/media.js";
import { isAuthUser } from "../../../utils/verifyToken.js";

const router = express.Router();

// CREATE;
// router.post("/cloudinaryImage", verifyUser, cloudinaryImage);

// router.post("/cloudinaryImageFile", verifyUser, cloudinaryImageFile);

router.post("/media", isAuthUser, createMedia);

router.put("/:id", isAuthUser, updateMedia);

router.delete("/media/:id", isAuthUser, deleteMedia);

router.get("/getAllMedia", isAuthUser, getAllMedia);

router.get("/media/:userId", isAuthUser, getUserMedia);

router.get("/media/search", isAuthUser, getSearchMedia);

router.get("/getMediaPerPage", isAuthUser, getMediaPerPage);

export default router;
