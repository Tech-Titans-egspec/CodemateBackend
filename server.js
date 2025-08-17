import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import { initSocket } from "./src/socket.js";

config();

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // change for production
    methods: ["GET", "POST"],
  },
});

// Initialize socket handlers
initSocket(io);

// Make io accessible in routes/controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
