// posts model
const db = require("../db");

// get all posts (with comments_count, likes_count, liked_by_user)
exports.getPosts = (userId, callback) => {
  const sql = `
    SELECT 
      posts.*,
      users.email,
      (SELECT COUNT(*) 
         FROM post_comments 
        WHERE post_comments.post_id = posts.id) AS comments_count,
      (SELECT COUNT(*) 
         FROM post_likes 
        WHERE post_likes.post_id = posts.id) AS likes_count,
      EXISTS(
        SELECT 1 
        FROM post_likes 
       WHERE post_likes.post_id = posts.id
         AND post_likes.user_id = ?
      ) AS liked_by_user
    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY created_at DESC
  `;
  // Copilot helped with the EXISTS check for liked_by_user
  db.query(sql, [userId], callback);
};

// add new post
exports.createPost = (user_id, caption, image, callback) => {
  const sql = "INSERT INTO posts (user_id, caption, image) VALUES (?, ?, ?)";
  db.query(sql, [user_id, caption, image], callback);
};

// like a post
exports.likePost = (user_id, post_id, callback) => {
  const sql = "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)";
  db.query(sql, [user_id, post_id], callback);
};

// unlike a post
exports.unlikePost = (user_id, post_id, callback) => {
  const sql = "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?";
  db.query(sql, [user_id, post_id], callback);
};

// add comment
exports.addComment = (post_id, user_id, text, callback) => {
  const sql =
    "INSERT INTO post_comments (post_id, user_id, text) VALUES (?, ?, ?)";
  db.query(sql, [post_id, user_id, text], callback);
};

// get comments for a post
exports.getComments = (post_id, callback) => {
  const sql = `
    SELECT post_comments.*, users.email
      FROM post_comments
      JOIN users ON users.id = post_comments.user_id
     WHERE post_id = ?
     ORDER BY created_at ASC
  `;
  db.query(sql, [post_id], callback);
};
