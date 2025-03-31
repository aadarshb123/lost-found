import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const userSocketMap = new Map(); // Map<userId, socketId>

export function getReceiverSocketId(userId) {
  if (!userId) throw new Error("UserId is required");
  return userSocketMap.get(userId);
}

export function getOnlineUsers() {
  return Array.from(userSocketMap.keys());
}

// Clean up inactive connections
function cleanupInactiveUsers() {
  for (const [userId, socketId] of userSocketMap.entries()) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket || !socket.connected) {
      userSocketMap.delete(userId);
    }
  }
}

io.on("connection", (socket) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log(`Connection rejected (no token) - socket ID: ${socket.id}`);
    return socket.disconnect(true);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      console.log("Invalid JWT payload - no userId");
      return socket.disconnect(true);
    }

    console.log(`✅ User ${userId} connected: ${socket.id}`);
    userSocketMap.set(userId, socket.id);

    io.emit("getOnlineUsers", getOnlineUsers());

    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected: ${socket.id}`);
      userSocketMap.delete(userId);
      io.emit("getOnlineUsers", getOnlineUsers());
    });

    socket.on("error", (err) => {
      console.error(`Socket error from user ${userId}:`, err.message);
      userSocketMap.delete(userId);
      io.emit("getOnlineUsers", getOnlineUsers());
    });
  } catch (err) {
    console.error(
      `JWT verification failed for socket ${socket.id}:`,
      err.message
    );
    socket.disconnect(true);
  }
});

// Run cleanup every 5 minutes
setInterval(cleanupInactiveUsers, 5 * 60 * 1000);

export { io, app, server };
