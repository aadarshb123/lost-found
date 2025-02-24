import express from "express";
import { updatedItem } from "../controllers/item.controller.js";

const router = express.Router();

router.put("/items/:id", updateItem);

export default router;
