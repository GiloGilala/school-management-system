import express from "express";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanys,
  getCompany,
  getUsers,
  getAllCompanyBranchs,
 
} from "../controllers/user.js";

import { isAuthUser } from "../../../../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", isAuthUser, createCompany);

//UPDATE
router.put("/:id", isAuthUser, updateCompany);

//DELETE
router.delete("/:id", isAuthUser, deleteCompany);

//GET ALL
router.get("/", isAuthUser, getAllCompanys);

//GET
router.get("/:id", isAuthUser, getCompany);

//GET
router.get("/branchs", isAuthUser, getAllCompanyBranchs);

//GET ALL 
router.get("/:branchName", isAuthUser, getCompanyBranch);


export default router;
