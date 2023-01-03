import express from "express";
import {
  createNote,
  updateNote,
  deleteNote,
  getAllNotes,
} from "../controllers/note.js";
// import { upload1 } from "../../../middleware/multer.js";

import { isAuthUser } from "../../../utils/verifyToken.js";
const router = express.Router();

// CREATE;
// router.Note("/upload", upload1.single("file")),
//   (req, res) => {
//     res.status(200).json("File has been uploaded");
//   };

// CREATE;
router.post("/", isAuthUser, createNote);

//UPDATE
router.put("/:slug", isAuthUser, updateNote);

//DELETE
router.delete("/:slug", isAuthUser, deleteNote);

//GET
router.get("/:slug", isAuthUser, getAllNotes);

export default router;
