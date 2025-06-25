const home = require("./home");
const auth = require("./auth");
const concept = require("./concept");
const manager = require("./manage");
function router(app) {
  app.use("/concept", concept);
  app.use("/manager", manager);
  app.use("/auth", auth);
  app.use("/", home);
}

module.exports = router;
