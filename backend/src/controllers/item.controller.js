import Item from "../models/item.model.js";

export const updateItem = async (req, res) => {
    try {
        const updateItem = await Item.findByIdAndUpdate(Req.params.id, req.body, { new: true });

        if (!updatedItem) return res.status(404).json({ success: false, message: "Item not found" });
        
        res.status(201).json({ success: true, message: "Item updated successfully", data: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating item", error: error.message });
    }
};