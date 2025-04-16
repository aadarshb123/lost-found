import express from "express";
import {
  sendMessage,
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
  startItemConversation
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, sendMessage);
router.post("/markSeen/:otherUserId", protectRoute, markMessagesAsSeen);
router.post("/item/:itemId", protectRoute, startItemConversation);

export default router;
