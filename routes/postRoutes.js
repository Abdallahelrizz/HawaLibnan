// posts routes
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { deletePost } = require("../controllers/postController");

// get all posts
router.get("/", postController.getPosts);

// create post
router.post("/", postController.createPost);

// like post
router.post("/like", postController.likePost);

// unlike post
router.post("/unlike", postController.unlikePost);

// add comment
router.post("/comment", postController.addComment);

// get comments for a post
router.get("/:id/comments", postController.getComments);

// delete post
router.delete("/:id", deletePost);

module.exports = router;
