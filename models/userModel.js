// User model - database queries for users
const db = require("../db");

exports.findByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};

exports.createUser = (email, password, callback) => {
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, password], callback);
};

// Get user by ID for profile page
function getUserById(id, callback) {
  db.query(
    "SELECT id, email, profile_image, bio FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return callback(err);

      if (results.length === 0) {
        return callback(null, null);
      }

      callback(null, results[0]);
    }
  );
}

// Update profile image and bio
function updateUserProfile(id, profileImage, bio, callback) {
  db.query(
    "UPDATE users SET profile_image = ?, bio = ? WHERE id = ?",
    [profileImage, bio, id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
}

exports.getUserById = getUserById;
exports.updateUserProfile = updateUserProfile;
