import Item from "../models/item.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

// Update item (with ownership check and optional image update)
export const updateItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const { image, ...rest } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let imageUrl = item.imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "items",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      });
      imageUrl = uploadResponse.secure_url;
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
    const { image, ...rest } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "items",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });

    const item = new Item({
      ...rest,
      imageUrl: uploadResponse.secure_url,
      user: req.user._id,
    });

    await item.save();

    res.status(201).json({ message: "Item created successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete item (with ownership check)
export const deleteItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
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
