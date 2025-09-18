const bcrypt = require("bcrypt");
const Person = require("../models/User");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongose");
class manageController {

  //[GET] /manager
  async personnel(req, res) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    res.render("personnel", { person });
  }

  //[DELETE] /manager/personnel/:id
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
    const countCEO = await Person.countDocuments({ role: "CEO" });
    const CEO = { count: countCEO, color: "#0ABAB5" };

    const totalRecords = await Person.estimatedDocumentCount();
    res.render("form_basic", { person, CEO, totalRecords });
  }

  //[POST /manager/personnel/add
  async addPersonnel(req, res) {
    const { name, email, phone, address, role, password, avatar } = req.body;
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

  //[GET] /manager/personnel/edit/:id
  async editPersonnel(req, res, next) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    const personnelID = await Person.findById(req.params.id);
    console.log(personnelID.name);
    res.render("personnel_edit", {
      person,
      personnelID: mongooseToObject(personnelID),
    });
  }

  //[POSST] /manager/personnel/update/:id
  async updatePersonnel(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    console.log(id, data);

    Person.findById(id)
      .then((person) => {
        if (!person) {
          return res.status(404).send("Perosnnel not found");
        }
        Person.updateOne({ _id: id }, data)
          .then(() => res.redirect("/manager"))
          .catch(next);
      })
      .catch(next);
  }

  //[POST] /manager/personnel/search/:id
  async searchPersonnel(req, res, next) {
    const search = req.query.findPersonnel;
    console.log(search);
    const results = await Person.find({
      name: { $regex: search, $options: "i" },
    });
    res.render("personnel", { search, person: mutipleMongooseToObject(results) });
    // res.json(results)
  }
}

module.exports = new manageController();
