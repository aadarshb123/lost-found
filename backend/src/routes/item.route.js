import express from "express";
import {
  updateItem,
  createItem,
  deleteItem,
  getItems,
} from "../controllers/item.controller.js";

const router = express.Router();

router.put("/updateItem/:id", updateItem);
router.post("/createItem", createItem);
router.delete("/deleteItems/:id", deleteItem);
router.get("/getItems", getItems);

export default router;
