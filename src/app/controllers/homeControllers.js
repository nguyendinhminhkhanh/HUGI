// const Admin = require("../models/products");

class homeControllers {

    async dashboard(req, res) {
        res.render('home');
    }

}

module.exports = new homeControllers;
