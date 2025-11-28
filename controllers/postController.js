// Post controller - handles HTTP requests for posts

const db = require("../db");
const Post = require("../models/postModel");

// get all posts
exports.getPosts = (req, res) => {
  const userId = Number(req.query.user_id) || 0;

  Post.getPosts(userId, (err, results) => {
    if (err) return res.status(500).send("error loading posts");
    res.json(results);
  });
};

exports.createPost = (req, res) => {
  const { user_id, caption, image } = req.body;

  if (!user_id || !caption) {
    return res.status(400).send("missing user_id or caption");
  }

  Post.createPost(user_id, caption, image, (err) => {
    if (err) return res.status(500).send("error creating post");
    res.send("post added");
  });
};

exports.likePost = (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
    return res.status(400).send("missing user_id or post_id");
  }

  Post.likePost(user_id, post_id, (err) => {
    if (err) {
      // already liked, just ignore it
      if (err.code === "ER_DUP_ENTRY") return res.send("already liked");
      return res.status(500).send("like error");
    }
    res.send("liked");
  });
};

exports.unlikePost = (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
    return res.status(400).send("missing user_id or post_id");
  }

  Post.unlikePost(user_id, post_id, (err) => {
    if (err) return res.status(500).send("unlike error");
    res.send("unliked");
  });
};

// add comment
exports.addComment = (req, res) => {
  const { post_id, user_id, text } = req.body;

  if (!post_id || !user_id || !text) {
    return res.status(400).send("missing fields");
  }

  Post.addComment(post_id, user_id, text, (err) => {
    if (err) return res.status(500).send("comment error");
    res.send("comment added");
  });
};

// Delete post - only owner can delete
exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.body.user_id;

  if (!postId || !userId) {
    return res.status(400).send("missing post id or user id");
  }

  // check if user owns the post
  db.query("SELECT user_id FROM posts WHERE id = ?", [postId], (err, rows) => {
    if (err) return res.status(500).send("error checking post");
    if (rows.length === 0) return res.status(404).send("post not found");

    if (Number(rows[0].user_id) !== Number(userId)) {
      return res.status(403).send("not your post");
    }

    // delete likes first, then comments, then post (Copilot helped with the order)
    db.query("DELETE FROM post_likes WHERE post_id = ?", [postId], (err2) => {
      if (err2) return res.status(500).send("error deleting likes");

      // then delete comments
      db.query("DELETE FROM post_comments WHERE post_id = ?", [postId], (err3) => {
        if (err3) return res.status(500).send("error deleting comments");

        // finally delete the post
        db.query("DELETE FROM posts WHERE id = ?", [postId], (err4) => {
          if (err4) return res.status(500).send("error deleting post");
          res.send("post deleted");
        });
      });
    });
  });
};

// get comments for a post
exports.getComments = (req, res) => {
  const post_id = req.params.id;

  Post.getComments(post_id, (err, results) => {
    if (err) {
      console.error("getComments error:", err);
      return res.status(500).send("error loading comments");
    }
    res.json(results);
  });
};
