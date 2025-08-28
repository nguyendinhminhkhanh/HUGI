const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
class authController {
  //[GET] /auth/login
  login(req, res, next) {
    res.render("auth/login", { layout: "auth" });
  }

  //[GET] /auth/register
  register(req, res, next) {
    console.log(req.error);
    res.render("auth/register", { layout: "auth" });
  }

  // //[POST] /auth/login
  async loginHandle(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(400).render("auth/login", {
          layout: "auth",
          error: "Tài khoản không tồn tại !",
          oldInput: req.body,
        });
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        console.log("Đăng nhập thành công");
        // return res.status(200).json({result: existingUser.role})
        const token = jwt.sign(
          { userId: existingUser._id, email: existingUser.email }, // Payload
          process.env.JWT_SECRET, // Secret key
          { expiresIn: "1h" } // Thời gian hết hạn
        );

        req.session.existingUser = existingUser;
        console.log(req.session);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000, // 1 giờ
          sameSite: "Strict",
        });

        res.redirect("/");
        // res.status(200).json({
        //     message: "Đăng nhập thành công",
        //     data: {
        //         token
        //     }
        // })
      } else {
        return res.status(400).render("auth/login", {
          layout: "auth",
          error: "Thông tin đăng nhập không đúng !",
          oldInput: req.body,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST] /auth/logout
  async logoutHandle(req, res, next) {
    try {
      res.clearCookie("connect.sid"); // Tên cookie mặc định cho express-session
      req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect("/auth/login");
      });
    } catch (error) {
      next(error);
    }
  }

  //[POST] /auth/register
  async registerHandle(req, res, next) {
    try {
      let successMessage = "Đăng kí thành công";
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }],
      });

      if (existingUser) {
        let errorMessage = "Tài khoản đã tồn tại với ";
        if (existingUser.email === email) errorMessage += "email này. ";

        return res.status(400).render("auth/register", {
          layout: "auth",
          error: errorMessage,
          oldInput: req.body,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...req.body,
        password: hashedPassword,
      });
      await user.save();

      res.render("auth/login", { layout: "auth", success: successMessage });
    } catch (err) {
      next(err);
    }
  }

  //[GET] /auth/login-required
  async login_required(req, res, next) {
    res.render('login-required');
  }
}

module.exports = new authController();
