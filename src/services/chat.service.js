import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

/**
 * ✅ Get all chats for a user (with participants + last message)
 */
export const getUserChats = async (userId) => {
  return await Chat.find({ participants: userId })
    .populate("participants", "username email")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "username email" },
    })
    .sort({ updatedAt: -1 });
};

/**
 * ✅ Get all messages between two users
 */
export const getChatMessages = async (user1, user2) => {
  const chat = await Chat.findOne({
    participants: { $all: [user1, user2] },
  }).populate({
    path: "messages",
    populate: { path: "sender", select: "username email" },
  });

  return chat ? chat.messages : [];
};

/**
 * ✅ Create a chat between two users
 */
export const createChat = async (user1, user2) => {
  let chat = await Chat.findOne({
    participants: { $all: [user1, user2] },
  });

  if (!chat) {
    chat = await Chat.create({ participants: [user1, user2] });
  }

  return chat;
};

/**
 * ✅ Send a message (auto-create chat if not exists)
 */
export const sendMessage = async (from, to, text) => {
  // 1️⃣ Ensure chat exists
  let chat = await Chat.findOne({
    participants: { $all: [from, to] },
  });

  if (!chat) {
    chat = await Chat.create({ participants: [from, to] });
  }

  // 2️⃣ Create message
  const message = await Message.create({
    chat: chat._id,
    sender: from,
    text,
  });

  // 3️⃣ Update chat
  chat.messages.push(message._id);
  chat.lastMessage = message._id;
  await chat.save();

  // 4️⃣ Return populated message (for frontend use)
  return await message.populate("sender", "username email");
};
