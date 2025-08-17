import express from "express";
import * as chatController from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// Get all chats for logged-in user
router.get("/", chatController.getUserChats);

// Get chat messages between two users
router.get("/:otherUserId/messages", chatController.getChatMessages);

// Create chat manually (optional, usually auto-created on first message)
router.post("/create", chatController.createChat);

// Send new message (auto-creates chat if not exists)
router.post("/send", chatController.sendMessage);

export default router;
