require("dotenv").config();
const express = require("express");
const http = require("http");
const session = require("express-session");
const path = require("path");
const db = require("./config/db");
const router = require("./routers");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const moment = require("moment");
const port = 3000;
const morgan = require("morgan");
const websocketServer = require("./websocket/websocket");
const fileUpload = require("express-fileupload");
const { create } = require("express-handlebars");

const app = express();

app.use(
  fileUpload({
    //Dùng để upload file
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// // Cấu hình session
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Khai báo session middleware
const sessionMiddleware = session({
  secret: "mysecret",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

const server = http.createServer(app);
// Khởi động websocket
websocketServer(server, sessionMiddleware);

app.use((req, res, next) => {
  res.locals.existingUser = req.session.existingUser || null;
  next();
});

db.connect();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Cho phép gửi cookie
  })
);

app.use(express.json()); // Hỗ trợ JSON request
app.use(methodOverride("_method")); //Middleware Xử Lý _method=DELETE(UPDATE) khi dùng form

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
// Cấu hình Handlebars (phiên bản <6.0.0)
const hbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "resources/views/layouts"),
  partialsDir: path.join(__dirname, "resources/views/partials"),
  extname: ".hbs",
  // Tạo helper 'eq' cho Handlebars
  helpers: {
    sum: (a, b) => a + b,
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    multiply: (a, b) => a * b,
    not:(value) => !value,
    formatDate: function (date) {
      //convert time
      return moment(date).format("DD/MM/YYYY");
    },
    // Phiên bản nâng cao với nhiều tùy chọn
    formatDateTime: function(date, options) {
      if (!date) return '';
      
      // Lấy format từ options.hash (nếu có)
      const format = options.hash.format || "HH:mm - DD/MM/YYYY";
      return moment(date).format(format);
    },
  },
});

app.use(morgan("combined"));

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));

router(app);

server.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
