import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("/check", protectRoute, checkAuth);

export default router;
