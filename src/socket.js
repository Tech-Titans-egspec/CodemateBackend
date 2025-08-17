import { sendMessage as saveMessage } from "./services/chat.service.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // join chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    // send message realtime
    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      try {
        const message = await saveMessage(chatId, senderId, text);

        // emit to all users in chat
        io.to(chatId).emit("newMessage", message);
      } catch (err) {
        console.error("Message error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
