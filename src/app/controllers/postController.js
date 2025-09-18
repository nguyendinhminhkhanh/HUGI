const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const path = require("path");
class postController {
  //[GET] /posts/formCreate
  formCreate(req, res, next) {
    res.render("post");
  }

  //[POST] /posts/create
  async create(req, res, next) {
    const userId = req.session.existingUser._id.toString();
    const user_info = await User.findById(userId);

    let mediaData = null;
    // Di chuyển file vào thư mục public/upload

    if (req.files && req.files.mediaFile) {
      const file = req.files.mediaFile;
      const uploadFileName = Date.now() + "_" + file.name;
      const uploadPath = path.join(
        __dirname,
        "../../public/uploads",
        uploadFileName
      );

      // Di chuyển file vào thư mục public/upload
      await file.mv(uploadPath);

      mediaData = {
        type: file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("video")
          ? "video"
          : "file",
        url: "/uploads/" + uploadFileName, // Đường dẫn public
        alt: req.body.alt || "",
      };
    }
    const { media, ...bodyData } = req.body;

    const post = new Post({
      user_id: userId,
      user_info: {
        username: user_info.name,
        avatar: user_info.avatar || "",
      },
      media: mediaData ? [mediaData] : [],
      ...bodyData,
    });
    console.log(post);
    await post
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => next(err));
  }

  //[POST] post/:idPost/comments
  async comment(req, res, next) {
    try {
      const postId = req.params.id;
      const { content } = req.body; // lấy dữ liệu từ textarea

      if (!content || content.trim === "") {
        return res.status(400).send("Nội dung không được để trống!!!");
      }

      const userId = req.session.existingUser._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).send("Người dùng không tồn tại");
      }

      const comment = new Comment({
        post_id: postId,
        user_id: userId,
        user_info: {
          username: user.name,
          avatar: user.avatar || "",
        },
        content: content,
        media:[],
      });
      await comment.save();

      await Post.findByIdAndUpdate(postId,{
        $inc: {comments_count: 1},
      });


      //chuyển về trang của bài viết 
      res.redirect("/");


    } catch (err) {
      next(err);
    }
  }
}

module.exports = new postController();
