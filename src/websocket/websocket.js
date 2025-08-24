const socketIo = require("socket.io");
const Message = require("../app/models/Message");
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
    socket.on("sendMessage", (data) => {
      const roomId = [data.from, data.to].sort().join("_");
      console.log(roomId);
      const message = new Message({
        from: data.from,
        to: data.to,
        roomId,
        content: data.content,
      });
      message.save();

      console.log("👤 Người gửi:", data.username);
      console.log("💬 Nội dung :", data.message);
      io.emit("chatMessage", 
        data
      );
    });
    socket.on("disconnect", () => {
      console.log("1 người đã thoát ");
    });
  });
}

module.exports = websocketServer;
