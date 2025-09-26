const Post = require("../models/Post");
const Comment = require("../models/Comment");
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../../util/mongose");

class mypostController {
  //[GET] /mypost/:id  
  async mypost(req, res, next) {
    try {
      const id = req.params.id;

      // Lấy danh sách bài viết theo user_id
      const myposts = await Post.find({ user_id: id })
        .sort({ createdAt: -1 })
        .lean();

      //lấu số lượng bào viết
      const countPost = await Post.countDocuments({ user_id: id });

      // Lấy thêm comments cho từng post
      const mypostsWithComments = await Promise.all(
        myposts.map(async (post) => {
          const comments = await Comment.find({ post_id: post._id })
            .sort({ createdAt: -1 })
            .lean();
          return { ...post, comments };
        })
      );

      res.render("mypost", { myposts: mypostsWithComments, countPost: countPost });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new mypostController();
