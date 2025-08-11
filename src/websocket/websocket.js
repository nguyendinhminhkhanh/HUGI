const socketIo = require("socket.io");

function websocketServer(server, sessionMiddleware) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const usersOnline = {}; // username -> socket.id

  // Chuyển express-session middleware vào socket.io
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", (socket) => {
    socket.on("registerUser", (username) => {
      socket.username = username; // gắn username vào socket
      usersOnline[username] = socket.id;
      console.log("✅", username, "đã online", socket.id);
    });

    socket.on("sendPrivateMessage", ({ to, message }) => {
      const receiverSocketId = usersOnline[to];
      if (receiverSocketId) {
        // Gửi cho người nhận
        io.to(receiverSocketId).emit("chatMessage", {
          username: socket.username,
          message,
        });
        // Gửi lại cho người gửi để hiển thị tin nhắn của mình
        socket.emit("chatMessage", {
          username: socket.username,
          message,
        });
      }
    });

    socket.on("sendMessage", (msg) => {
      console.log("👤 Người gửi:", msg.username);
      console.log("💬 Nội dung :", msg.message);
      io.emit("chatMessage", msg);
    });
    socket.on("disconnect", () => {
      console.log("1 người đã thoát ");
    });
  });
}

module.exports = websocketServer;
