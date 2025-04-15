import Item from "../models/item.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

// Update item (with ownership check and optional image update)
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, ...rest } = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Only allow the owner to update the item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...rest, imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
};

// Create item with image upload and user assignment
export const createItem = async (req, res) => {
  try {
    const { type, description, date, category, status, location } = req.body;
    const userId = req.user._id;

    const newItem = new Item({
      type,
      description,
      date,
      category,
      status,
      location,
      userId,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: "Error creating item",
      error: error.message,
    });
  }
};

// Delete item (with ownership check)
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Only allow the owner to delete the item
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
};

// Get all items (public or filtered)
export const getItems = async (req, res) => {
  try {
    const { dateLost, dateFound, itemType, location, status } = req.query;

    let query = {};

    if (dateLost) {
      query.dateLost = { $gte: new Date(dateLost) };
    }
    if (dateFound) {
      query.dateFound = { $gte: new Date(dateFound) };
    }
    if (itemType) {
      query.itemType = itemType;
    }
    if (location) {
      query.location = new RegExp(location, "i");
    }
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
