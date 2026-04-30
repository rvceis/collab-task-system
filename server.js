import app from "./app.js";
import pool from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { logActivity } from "./app/services/activityService.js";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("Socket client connected:", socket.id);

  logActivity(
    null,
    null,
    "SOCKET_CONNECT",
    `Socket connected: ${socket.id}`
  ).catch((error) => {
    console.error("Activity log error:", error.message);
  });

  const joinProjectRoom = async (projectId) => {
    socket.join(`project_${projectId}`);

    await logActivity(
      null,
      Number(projectId),
      "SOCKET_JOIN_PROJECT",
      `Socket ${socket.id} joined project ${projectId}`
    );
  };

  const leaveProjectRoom = async (projectId) => {
    socket.leave(`project_${projectId}`);

    await logActivity(
      null,
      Number(projectId),
      "SOCKET_LEAVE_PROJECT",
      `Socket ${socket.id} left project ${projectId}`
    );
  };

  socket.on("joinProject", (projectId) => {
    joinProjectRoom(projectId).catch((error) => {
      console.error("Activity log error:", error.message);
    });
  });
  socket.on("join_project", (projectId) => {
    joinProjectRoom(projectId).catch((error) => {
      console.error("Activity log error:", error.message);
    });
  });

  socket.on("leaveProject", (projectId) => {
    leaveProjectRoom(projectId).catch((error) => {
      console.error("Activity log error:", error.message);
    });
  });
  socket.on("leave_project", (projectId) => {
    leaveProjectRoom(projectId).catch((error) => {
      console.error("Activity log error:", error.message);
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket client disconnected:", socket.id);

    logActivity(
      null,
      null,
      "SOCKET_DISCONNECT",
      `Socket disconnected: ${socket.id}`
    ).catch((error) => {
      console.error("Activity log error:", error.message);
    });
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected:", res.rows[0]);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

startServer();