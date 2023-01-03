import express from "express";
import {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getRoleName,
  getAllRoles,
 
} from "../controllers/Role.js";

import { isAuthUser } from "../../../../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.put("/role/:id", isAuthUser, createRole);

//UPDATE
router.put("/role/:id", isAuthUser, updateRole);

//DELETE
router.delete("/role/:id", isAuthUser, deleteRole);

//GET
router.get("/role/find/:id", isAuthUser, getRole);
//GET
router.get("/role/find/:name", isAuthUser, getRoleName);

//GET ALL
router.get("/role/", isAuthUser, getAllRoles);

export default router;
