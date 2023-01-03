import express from "express";
import {
  createBloodgroup,
  updateBloodgroup,
  deleteBloodgroup,
  getBloodgroup,
  getBloodgroupName,
  getAllBloodgroups,
 
} from "../controllers/Bloodgroup.js";

import { isAuthUser } from "../../../../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.put("/bloodgroup/:id", isAuthUser, createBloodgroup);

//UPDATE
router.put("/bloodgroup/:id", isAuthUser, updateBloodgroup);

//DELETE
router.delete("/bloodgroup/:id", isAuthUser, deleteBloodgroup);

//GET
router.get("/bloodgroup/find/:id", isAuthUser, getBloodgroup);

//GET
router.get("/bloodgroup/find/:name", isAuthUser, getBloodgroupName);


//GET ALL
router.get("/bloodgroup/", isAuthUser, getAllBloodgroups);

export default router;
