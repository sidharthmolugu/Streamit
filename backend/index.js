const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");
const path = require("path");
const videosRouter = require("./routes/videos");
const authRouter = require("./routes/auth");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ---------------------
// Allowed origins
// ---------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://pulse-assignment-livid.vercel.app",
];

// ---------------------
// Socket.io
// ---------------------
const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ---------------------
// Express CORS
// ---------------------
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// Routes
// ---------------------
app.use("/api/auth", authRouter);
app.use("/api/videos", videosRouter(io));

// ---------------------
// MongoDB
// ---------------------
const MONGO =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/video_sensitivity";

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo connected"))
  .catch((e) => console.error("Mongo connection error", e));

// ---------------------
// Start server
// ---------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
