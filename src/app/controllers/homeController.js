
class homeController {

    async dashboard(req, res) {
        res.render('index');
    }

}

module.exports = new homeController;
