const express = require("express");
const app = express();
const router = require("./routers");
const { create } = require("express-handlebars");
const port = 3000;
const morgan = require("morgan");
const path = require("path");

app.use(morgan("combined"));

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
