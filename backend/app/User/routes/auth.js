import express from "express";
import {
  login,
  logout,
  register,
  refresh,
  signin,
} from "../controllers/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/signin", signin);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
