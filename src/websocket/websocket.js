const socketIo = require("socket.io");

function websocketServer(server, sessionMiddleware) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("1 người  đã kêt nối ", socket.id);
    socket.on("setUserName", (username) => {
      socket.username = username;
      console.log(username);
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
