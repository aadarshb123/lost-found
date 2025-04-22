import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import Item from "../models/item.model.js";

// Get users with conversations
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    }).sort({ createdAt: -1 });

    // Get unique user IDs from messages
    const userIds = new Set();
    messages.forEach(message => {
      if (message.senderId.toString() !== loggedInUserId.toString()) {
        userIds.add(message.senderId);
      }
      if (message.receiverId.toString() !== loggedInUserId.toString()) {
        userIds.add(message.receiverId);
      }
    });

    // Get user details for each unique user ID
    const users = await User.find({
      _id: { $in: Array.from(userIds) }
    }).select("-password");

    // Get the latest message for each user
    const usersWithLatestMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...user.toObject(),
          lastMessage,
        };
      })
    );

    // Sort by latest message
    usersWithLatestMessage.sort((a, b) => {
      return new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt);
    });

    res.status(200).json(usersWithLatestMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send a message (text or image)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isSeen: false,
    });

    await newMessage.save();

    // Get sender and receiver socket IDs
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    // Emit to receiver if online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Emit to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Mark all unseen messages from a specific sender as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    const result = await Message.updateMany(
      { senderId, receiverId, isSeen: false },
      { $set: { isSeen: true } }
    );

    // Emit message seen event to sender
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { senderId, receiverId });
    }

    res.status(200).json({
      message: "Messages marked as seen",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in markMessagesAsSeen:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const startItemConversation = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    // Get the item and its owner
    const item = await Item.findById(itemId).populate('userId');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const receiverId = item.userId._id;

    // Create the initial message
    const message = await Message.create({
      senderId,
      receiverId,
      text: `Regarding your ${item.type} item: ${text}`,
      isSeen: false
    });

    // Get sender and receiver socket IDs
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    // Emit to receiver if online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    // Emit to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
