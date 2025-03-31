import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation: ensure at least text or image is present
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    this.invalidate("text", "Message must contain text or an image.");
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
