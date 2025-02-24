import express from "express";
import { updatedItem, createItem, deletedItem, getItems } from "../controllers/item.controller.js";

const router = express.Router();

router.put("/items/:id", updateItem);
router.post("/items", createItem);
router.delete("/items/:id", deleteItem);
router.get("/items", getItems);

export default router;
