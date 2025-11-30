// posts model
const db = require("../db");

// get all posts (with comments_count, likes_count, liked_by_user)
exports.getPosts = async (userId) => {
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
  const [rows] = await db.query(sql, [userId]);
  return rows;
};

// add new post
exports.createPost = async (user_id, caption, image) => {
  const sql = "INSERT INTO posts (user_id, caption, image) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [user_id, caption, image]);
  return result;
};

// like a post
exports.likePost = async (user_id, post_id) => {
  const sql = "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)";
  const [result] = await db.query(sql, [user_id, post_id]);
  return result;
};

// unlike a post
exports.unlikePost = async (user_id, post_id) => {
  const sql = "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?";
  const [result] = await db.query(sql, [user_id, post_id]);
  return result;
};

// add comment
exports.addComment = async (post_id, user_id, text) => {
  const sql =
    "INSERT INTO post_comments (post_id, user_id, text) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [post_id, user_id, text]);
  return result;
};

// get comments for a post
exports.getComments = async (post_id) => {
  const sql = `
    SELECT post_comments.*, users.email
      FROM post_comments
      JOIN users ON users.id = post_comments.user_id
     WHERE post_id = ?
     ORDER BY created_at ASC
  `;
  const [rows] = await db.query(sql, [post_id]);
  return rows;
};
