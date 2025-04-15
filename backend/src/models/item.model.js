import mongoose from "mongoose";

//item schema:
const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    building: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'accessories', 'books', 'documents', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed', 'in_progress'],
    default: 'open'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
