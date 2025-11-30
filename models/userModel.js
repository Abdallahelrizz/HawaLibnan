// User model - database queries for users
const db = require("../db");

exports.findByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await db.query(sql, [email]);
  return rows;
};

exports.createUser = async (email, password) => {
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  const [result] = await db.query(sql, [email, password]);
  return result;
};

// Get user by ID for profile page
async function getUserById(id) {
  const [rows] = await db.query(
    "SELECT id, email, profile_image, bio FROM users WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

// Update profile image and bio
async function updateUserProfile(id, profileImage, bio) {
  const [result] = await db.query(
    "UPDATE users SET profile_image = ?, bio = ? WHERE id = ?",
    [profileImage, bio, id]
  );
  return result;
}

exports.getUserById = getUserById;
exports.updateUserProfile = updateUserProfile;
