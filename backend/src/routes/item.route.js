import express from "express";
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getUserForItem
} from "../controllers/item.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect create/update/delete routes
router.post("/createItem", protectRoute, createItem);
router.put("/updateItem/:id", protectRoute, updateItem);
router.delete("/deleteItem/:id", protectRoute, deleteItem);

// protect getItems if you want to show only user-specific items
router.get("/getItems", getItems); // or protectRoute if needed

router.get("/:id", getItem);
router.get("/:id/user", getUserForItem);

export default router;
