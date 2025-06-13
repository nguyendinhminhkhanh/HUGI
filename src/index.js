require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./config/db");
const router = require("./routers");
const port = 3000;
const morgan = require("morgan");

const app = express();

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const { create } = require("express-handlebars");

db.connect();
app.use(express.json());

app.use(morgan("combined"));

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
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));

router(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
