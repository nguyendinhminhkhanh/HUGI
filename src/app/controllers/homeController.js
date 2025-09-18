const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { mongooseToObject ,mutipleMongooseToObject} = require("../../util/mongose");
class homeController {
  async dashboard(req, res) {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    // Lặp qua từng post để lấy comments (Hơi mất thời gian )
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ post_id: post._id })
          .sort({ createdAt: -1 })
          .lean();
        return { ...post, comments };
      })
    );
    res.render("index", { posts: postsWithComments});
    // res.send(mutipleMongooseToObject(postsWithComments));
  }
}

module.exports = new homeController();
