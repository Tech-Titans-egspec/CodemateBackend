import * as chatService from "../services/chat.service.js";

//  Get all chats for logged-in user
export const getUserChats = async (req, res) => {
  try {
    const chats = await chatService.getUserChats(req.user.id);
    res.json(chats);
  } catch (err) {
    console.error("❌ getUserChats error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Get all messages between logged-in user and another user
export const getChatMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await chatService.getChatMessages(req.user.id, otherUserId);
    res.json(messages);
  } catch (err) {
    console.error("❌ getChatMessages error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Manually create chat
export const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const chat = await chatService.createChat(req.user.id, otherUserId);
    res.json(chat);
  } catch (err) {
    console.error("❌ createChat error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Send message (auto-create chat if not exists)
export const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const message = await chatService.sendMessage(req.user.id, to, text);

    //  Emit via Socket.IO (global io attached to app)
    const io = req.app.get("io");
    io.to(message.chat.toString()).emit("newMessage", message);

    res.json(message);
  } catch (err) {
    console.error("❌ sendMessage error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
