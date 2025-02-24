import mongoose from "mongoose";

//item schema:
const itemSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateLost: { type: Date, required: true },
    dateFound: { type: Date, required: true },
    imageUrl: { type: String },
    status: {type: String, required: true, Enum: ['lost', 'found', 'claimed']},
    itemType: {type: String, required: true, Enum: ['electronics', 'clothing', 'personal', 'other']},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } //for updating item
  });

const Item = mongoose.model("Item", itemSchema);
export default Item;
