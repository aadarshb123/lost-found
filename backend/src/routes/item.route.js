import express from "express";
import {
  updateItem,
  createItem,
  deleteItem,
  getItems,
} from "../controllers/item.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect create/update/delete routes
router.post("/createItem", protectRoute, createItem);
router.put("/updateItem/:id", protectRoute, updateItem);
router.delete("/deleteItems/:id", protectRoute, deleteItem);

// protect getItems if you want to show only user-specific items
router.get("/getItems", getItems); // or protectRoute if needed

export default router;
