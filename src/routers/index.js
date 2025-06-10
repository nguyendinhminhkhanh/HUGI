const home = require("../app/controllers/homeControllers")
function router(app) {
  app.use("/", home.dashboard);

}

module.exports = router;
