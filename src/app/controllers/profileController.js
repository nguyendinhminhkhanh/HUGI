class homeController {
  async profile(req, res) {
    const userSession = req.session.existingUser;
    console.log(userSession);
    res.render("form_profile", {
      existingUser: userSession,
    });
  }

  async editImage(req, res) {
    const userSession = req.session.existingUser;
    console.log(userSession);
    res.render("form_profile", {
      existingUser: userSession,
    });
  }
}

module.exports = new homeController();
