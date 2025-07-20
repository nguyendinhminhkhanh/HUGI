const home = require("./home");
const auth = require("./auth");
const concept = require("./concept");
const manager = require("./manage");
const profile = require("./profile");
const mailbox = require("./mailbox");
function router(app) {
  app.use("/profile", profile);
  app.use("/concept", concept);
  app.use("/manager", manager);
  app.use("/mailbox", mailbox);
  app.use("/auth", auth);
  app.use("/", home);
}

module.exports = router;
