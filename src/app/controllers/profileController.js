class homeController {
  async profile(req, res) {
    const userSession = req.session.existingUser; 
    console.log(userSession);
    res.render("form_profile.hbs", {
      existingUser: userSession,
    });
  }
}

module.exports = new homeController();
