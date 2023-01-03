import express from "express";
import {
  createCategory,
  updateCategory,
  updateCategory2,
  deleteCategory,
  getCategory,
  getAllCategories,
  // singleCategory,
  //   getCategorys,
} from "../../Blog/controllers/category.js";
import { isAuthUser, isAuthRoles } from "../../../utils/verifyToken.js";

const router = express.Router();

// CREATE;
router.post("/", isAuthUser, createCategory);

//UPDATE
router.put("/:id", isAuthUser, updateCategory);
//UPDATE
router.put("/cat/:slug", isAuthUser, updateCategory2);

//DELETE
router.delete("/:slug", deleteCategory);

//GET
router.get("/:slug", isAuthUser, getCategory);
// router.get("/:slug", isAuthUser, singleCategory);

//GET ALL
router.get("/", getAllCategories);

export default router;
