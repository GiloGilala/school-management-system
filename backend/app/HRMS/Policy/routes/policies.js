import express from "express";
import {
 createPolicy,
  getPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy,
  getPoliciesByDept,
 
} from "../controllers/policy.js";

import { isAuthUser } from "../../../../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/policy/", isAuthUser, createPolicy);

//UPDATE
router.put("/policy/:id", isAuthUser, updatePolicy);

//DELETE
router.delete("/policy/:id", isAuthUser, deletePolicy);

//GET ALL
router.get("/policy/", isAuthUser, getPolicies);

//GET
router.get("/policy/:id", isAuthUser, getPolicy);

//GET
router.get("/policy/dept/:id'", isAuthUser, getPoliciesByDept);




export default router;
