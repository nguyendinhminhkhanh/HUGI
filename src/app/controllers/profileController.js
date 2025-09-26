const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const { mongooseToObject } = require("../../util/mongose");
const { mutipleMongooseToObject } = require("../../util/mongose");
class profileController {
  //[GET] /profile
  async profile(req, res) {
    const userSession = req.session.existingUser;
    console.log(userSession);
    res.render("form_profile", {
      existingUser: userSession,
    });
  }

  //[POST] /manager/personnel/update/:id
  async editAvatar(req, res, next) {
    try {
      if (!req.session.existingUser) {
        return res.status(401).send("Chưa đăng nhập");
      }

      const existingUserId = req.session.existingUser._id;
      const imageFile = req.files?.image;

      if (!imageFile) {
        return res.status(400).send("Chưa chọn ảnh để tải lên.");
      }

      const user = await User.findById(existingUserId);
      if (!user) {
        return res.status(404).send("Không tìm thấy người dùng.");
      }

      // Xóa ảnh cũ nếu có
      if (user.avatar) {
        const oldImagePath = path.join(__dirname, "../../public", user.avatar);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.warn("Không xoá được ảnh cũ:", err.message);
          } else {
            console.log("Đã xoá ảnh cũ:", oldImagePath);
          }
        });
      }

      // Lưu ảnh mới
      const uploadFileName = Date.now() + "_" + imageFile.name; // đổi tên để tránh trùng
      const uploadPath = path.join(
        __dirname,
        "../../public/uploads",
        uploadFileName
      );
      const avatarPath = "/uploads/" + uploadFileName;

      imageFile.mv(uploadPath, async (err) => {
        if (err) {
          console.error("Lỗi khi upload ảnh mới:", err);
          return next(err);
        }

        // Cập nhật avatar mới vào DB
        await User.updateOne({ _id: existingUserId }, { avatar: avatarPath });

        // Cập nhật vào session
        req.session.existingUser.avatar = avatarPath;
        return res.redirect("/profile");
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new profileController();
