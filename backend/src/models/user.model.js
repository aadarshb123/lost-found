import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }
});

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

const User = mongoose.model("User", userSchema);
export default User;
