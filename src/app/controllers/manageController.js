const Person = require("../models/User");
class manageController {
  async personnel(req, res) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    res.render("personnel", { person });
  }

  //[DELETE] /manager//personnel/:id
  async removePersonnel(req, res) {
    //cần phải check tài khảo đang đăng nhặp , có thể xoá nhầm tài khoản đang đăng nhập
    Person.findById(req.params.id)
      .then((personnel) => {
        if (!personnel) {
          return res
            .status(404)
            .json({ success: false, message: "Personnel not found" });
        }
        console.log(req.params.id);
        return Person.deleteOne({ _id: req.params.id });
      })
      .then(() => res.redirect("back"));
  }

  //[GET] /manager//personnel/add-form
  addForm(req,res,next){
    res.render('form_basic')
  }

}

module.exports = new manageController();
