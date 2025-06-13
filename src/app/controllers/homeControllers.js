
class homeControllers {

    async dashboard(req, res) {
        res.render('index');
    }

}

module.exports = new homeControllers;
