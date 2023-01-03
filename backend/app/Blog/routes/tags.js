import express from "express";
import {
  createTag,
  updateTag,
  deleteTag,
  getTag,
  getAllTag,
  //   getTags,
} from "../../Blog/controllers/tag.js";
import { isAuthUser } from "../../../utils/verifyToken.js";

const router = express.Router();

// CREATE;
router.post("/", createTag);

//UPDATE
router.put("/:slug", updateTag);

//DELETE
router.delete("/:slug", deleteTag);

//GET
router.get("/:slug", getTag);

//GET ALL
router.get("/", getAllTag);

export default router;
