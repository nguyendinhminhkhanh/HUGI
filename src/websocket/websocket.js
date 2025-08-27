const socketIo = require("socket.io");
const Message = require("../app/models/Message");

function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

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

    // Client yêu cầu vào phòng
    socket.on("joinRoom", async ({ userId1, userId2 }) => {
      const roomId = generateRoomId(userId1, userId2);
      socket.join(roomId); // Thêm client vào room
      console.log(`📥 ${socket.id} đã join room: ${roomId}`);

       // Lấy lịch sử từ DB
      const messages = await Message.find({ roomId }).sort({ createdAt: 1 })
        .populate("from", "name email")
        .populate("to", "name email");
      // Gửi lịch sử về cho client vừa join
      socket.emit("chatHistory", messages);

      // Gửi thông báo riêng cho room đó
      io.to(roomId).emit(
        "systemMessage",
        `Người dùng ${socket.id} đã vào phòng ${roomId}`
      );
    });

    socket.on("sendMessage", async (data) => {
      const roomId = [data.from, data.to].sort().join("_");
      console.log("mã phòng: " + roomId);
      const message = new Message({
        sender: data.sender,
        from: data.from,
        to: data.to,
        roomId,
        content: data.content,
      });
      await message.save();

      console.log("👤 Người gửi:", data.sender);
      console.log("💬 Nội dung :", data.message);

      io.to(roomId).emit("chatMessage", {
        sender: data.sender,
        from: data.from,
        to: data.to,
        content: data.content,
        createdAt: message.createdAt,
      });
    });
    socket.on("disconnect", () => {
      console.log(`Người dùng ID:  ${socket.id}  người đã thoát `);
    });
  });
}

module.exports = websocketServer;
