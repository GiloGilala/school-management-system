import express from "express";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentName,
  getAllDepartments,
 
} from "../controllers/department.js";

import { isAuthUser } from "../../../../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.put("/department/:id", isAuthUser, createDepartment);

//UPDATE
router.put("/department/:id", isAuthUser, updateDepartment);

//DELETE
router.delete("/department/:id", isAuthUser, deleteDepartment);

//GET
router.get("/department/find/:id", isAuthUser, getDepartment);

//GET
router.get("/department/find/:name", isAuthUser, getDepartmentName);


//GET ALL
router.get("/department/", isAuthUser, getAllDepartments);

export default router;
