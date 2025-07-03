const bcrypt = require("bcrypt");
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
  async addForm(req, res, next) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    res.render("form_basic", { person });
  }

  //[POST /manager/personnel/add
  async addPersonnel(req, res) {
    const { name, email, phone, address, role, password } = req.body;
    const checkUser = await Person.findOne({
      $or: [{ email }, { phone }],
    });
    if (checkUser) {
      let errorMessage = "Tài khoản đã tồn tại với ";
      if (checkUser.email === email) errorMessage += "email này. ";
      if (checkUser.phone === phone) errorMessage += "số điện thoại này.";

      console.log(errorMessage);
      return res.redirect("/manager/personnel/add-form");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const person = new Person({
      ...req.body,
      password: hashedPassword,
    });
    await person
      .save()
      .then(() => res.redirect("/manager"))
      .catch((err) => next(err));
  }
}

module.exports = new manageController();
