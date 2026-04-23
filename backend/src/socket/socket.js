import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import jwt from "jsonwebtoken";
import { AppConstants } from "../constant/appConstants.js";

export const initSocket = (server) => {

  // Server is the http server, express app uses the same server
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });


  // Connected
  io.on("connection", (socket) => {

    const token = socket.handshake.auth.token;

    // User data from token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, role, fullName } = decoded;

      socket.data.user = { id, role, fullName };

    } catch (error) {
      socket.disconnect();
      return;
    }

    // Join a room - roomIds
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("read-messages");
    });

    // Receive Message
    socket.on("send-message", (message) => {
      const senderId = socket.data.user.id;
      const senderName = socket.data.user.fullName;
      const senderRole = socket.data.user.role;
      const roomId = message.roomId;

      // Broadcast message 
      socket.broadcast.to(roomId).emit("receive-message", {
        text: message.text,
        senderId: senderId,
        senderName: senderRole === AppConstants.Role.Admin ? AppConstants.Role.Admin : senderName,
        roomId: roomId,
        isRead: message.isRead,
      })
    });

    // Message received => Send to mark isRead true
    socket.on("message-received", (message) => {
      socket.broadcast.to(message.roomId).emit("read-messages");
    })

  });

  // ui for socket
  instrument(io, { auth: false });

  return io;
};