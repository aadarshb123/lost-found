import mongoose from "mongoose";

//item schema:
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateLost: { type: Date, required: true },
    dateFound: { type: Date, required: true },
    imageUrl: { type: String }
    //lost or found type: boolean
    //type of item, 
    //need to filter by type, location, date found/lost
  
  });

const Item = mongoose.model("Item", itemSchema);
export default Item;
