import Item from "../models/item.model.js";
import mongoose from "mongoose";

export const updateItem = async (req, res) => {
  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const updateItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updateItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updateItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
};

export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();

    res.status(201).json({ message: "Item created successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//delete item
export const deleteItem = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

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

//get all items, implement filter logic
export const getItems = async (req, res) => {
  try {
    const { dateLost, dateFound, itemType, location, status } = req.query;

    // Build the query object dynamically
    let query = {};

    if (dateLost) {
      query.dateLost = { $gte: new Date(dateLost) }; // Finds items lost on or after the given date
    }
    if (dateFound) {
      query.dateFound = { $gte: new Date(dateFound) }; // Finds items found on or after the given date
    }
    if (itemType) {
      query.itemType = itemType; // Filters by item type
    }
    if (location) {
      query.location = new RegExp(location, "i"); // Case-insensitive search for location, currently uses pattern matching and cul == culc so fix later if needed
    }
    if (status) {
      query.status = status; // Filters by status if provided
    }

    // Fetch filtered items
    const items = await Item.find(query);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
