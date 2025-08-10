const socketIo = require("socket.io");

function websocketServer(server, sessionMiddleware) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Chuyển express-session middleware vào socket.io
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", (socket) => {
    // const session = socket.request.session;
    console.log("1 người  đã kêt nối ", socket.id);
    // console.log(session.existingUser.name);
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
