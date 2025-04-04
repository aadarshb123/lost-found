import express from "express";
import {
  sendMessage,
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/:id", protectRoute, sendMessage);
router.patch("/seen/:id", protectRoute, markMessagesAsSeen); //for marking mesages as seen

export default router;
