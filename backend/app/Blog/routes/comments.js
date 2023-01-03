import express from "express";
import {
  createComment,
  getUserComments,
  deleteComment,
  getCommentsPerPage,
  getAllComment,
  //   getComments,
} from "../controllers/comment.js";
// import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE;
router.post("/:postId", createComment);

//UPDATE
router.get("/:userId", getUserComments);

//DELETE
router.delete("/:commentId", deleteComment);

//GET
router.get("/:slug", getCommentsPerPage);

//GET ALL
router.get("/", getAllComment);

export default router;
