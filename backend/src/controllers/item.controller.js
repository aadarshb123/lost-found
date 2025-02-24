import Item from "../models/item.model.js";

export const updateItem = async (req, res) => {
    try {
        const updateItem = await Item.findByIdAndUpdate(Req.params.id, req.body, { new: true });

        if (!updatedItem) return res.status(404).json({ success: false, message: "Item not found" });
        
        res.status(200).json({ success: true, message: "Item updated successfully", data: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating item", error: error.message });
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
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) return res.status(404).json({ success: false, message: "Item not found" });

        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting item", error: error.message });
    }
};


//get all items, implement filter logic
export const getItems = async (req, res) => {
  try {
    const items = await Item.find();    
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
