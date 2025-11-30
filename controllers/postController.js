// Post controller - handles HTTP requests for posts

const db = require("../db");
const Post = require("../models/postModel");

// get all posts
exports.getPosts = async (req, res) => {
  try {
    const userId = Number(req.query.user_id) || 0;

    const results = await Post.getPosts(userId);
    res.json(results);
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).send("error loading posts");
  }
};

exports.createPost = async (req, res) => {
  try {
    const { user_id, caption, image } = req.body;

    if (!user_id || !caption) {
      return res.status(400).send("missing user_id or caption");
    }

    await Post.createPost(user_id, caption, image);
    res.send("post added");
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).send("error creating post");
  }
};

exports.likePost = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
      return res.status(400).send("missing user_id or post_id");
    }

    await Post.likePost(user_id, post_id);
    res.send("liked");
  } catch (err) {
    // already liked, just ignore it
    if (err.code === "ER_DUP_ENTRY") return res.send("already liked");
    console.error("likePost error:", err);
    res.status(500).send("like error");
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
      return res.status(400).send("missing user_id or post_id");
    }

    await Post.unlikePost(user_id, post_id);
    res.send("unliked");
  } catch (err) {
    console.error("unlikePost error:", err);
    res.status(500).send("unlike error");
  }
};

// add comment
exports.addComment = async (req, res) => {
  try {
    const { post_id, user_id, text } = req.body;

    if (!post_id || !user_id || !text) {
      return res.status(400).send("missing fields");
    }

    await Post.addComment(post_id, user_id, text);
    res.send("comment added");
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).send("comment error");
  }
};

// Delete post - only owner can delete
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.user_id;

    if (!postId || !userId) {
      return res.status(400).send("missing post id or user id");
    }

    // check if user owns the post
    const [rows] = await db.query("SELECT user_id FROM posts WHERE id = ?", [postId]);
    if (rows.length === 0) return res.status(404).send("post not found");

    if (Number(rows[0].user_id) !== Number(userId)) {
      return res.status(403).send("not your post");
    }

    // delete likes first, then comments, then post (Copilot helped with the order)
    await db.query("DELETE FROM post_likes WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM post_comments WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM posts WHERE id = ?", [postId]);
    
    res.send("post deleted");
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).send("error deleting post");
  }
};

// get comments for a post
exports.getComments = async (req, res) => {
  try {
    const post_id = req.params.id;

    const results = await Post.getComments(post_id);
    res.json(results);
  } catch (err) {
    console.error("getComments error:", err);
    res.status(500).send("error loading comments");
  }
};
