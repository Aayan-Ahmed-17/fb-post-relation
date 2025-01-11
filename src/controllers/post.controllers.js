import Post from "../models/posts.models.js";
import User from "../models/users.models.js";

const createPost = async (req, res) => {
  const { title, description } = req.body;
  try {
    const post = await Post.create({
      title,
      description,
      user: req.userId,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName")
      .populate("likes")
      .populate({
        path: "comments",
        select: "text",
        populate: ({
          path: "user",
          select: "firstName lastName",
        }),
      });
    const id = req.userId;
    // const userdata = await User.findById(id);
    res.json( posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createPost, getPost };
