const home = require("./home");
const auth = require("./auth");
const concept = require("./concept");
const manager = require("./manage");
const profile = require("./profile");
function router(app) {
  app.use("/profile", profile);
  app.use("/concept", concept);
  app.use("/manager", manager);
  app.use("/auth", auth);
  app.use("/", home);
} 

module.exports = router;
