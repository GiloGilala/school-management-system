import express from "express";
import {
  login,
  logout,
  register,
  refresh,
  signin,
  activateAccount,
  register1,
  forgetPassword,
  upDatePassword,
} from "../controllers/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/register1", register1);
router.post("/emailActivate", activateAccount);
router.post("/forgetPassword", forgetPassword);
router.put("/upDatePassword", upDatePassword);
router.post("/login", login);
router.post("/signin", signin);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
