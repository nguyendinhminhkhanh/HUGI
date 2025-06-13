const home = require("./home");
const auth = require("./auth");
function router(app) {
  app.use("/", home);
  app.use("/auth", auth);
}

module.exports = router;
