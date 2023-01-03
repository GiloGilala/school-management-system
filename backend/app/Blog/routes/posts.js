import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPost,
  getUserPosts,
  getSearchPost,
  getPostPerPage,
  postsByCategory,
  getRelatedPosts,
  sub,
  addView,
  search,
} from "../controllers/post.js";

import { isAuthUser } from "../../../utils/verifyToken.js";
import { upload } from "../../../middleware/multer.js";

const router = express.Router();

// CREATE;
// router.post("/upload", upload1.single("file")),
//   (req, res) => {
//     res.status(200).json("File has been uploaded");
//   };

// CREATE;
router.post("/", isAuthUser, createPost);
// router.post("/", isAuthUser, upload.single("image"), createPost);

//UPDATE
router.put("/:slug", isAuthUser, updatePost);

//DELETE
router.delete("/:slug", deletePost);

//GET
router.get("/:slug", getPost);

//GET
router.get("/:userId", getUserPosts);

//GET
router.get("post/find/", getSearchPost);

//GET
router.get("/postPerPage/", getPostPerPage);
//GET
router.get("/postPerPage/", getRelatedPosts);

//GET
router.get("/postsByCategory/", postsByCategory);

//GET ALL
router.get("/", getAllPost);

router.get("/sub", sub);

router.put("/view/:id", addView);

router.get("/search", search);

export default router;
