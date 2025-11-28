// Place model - database queries for places and reviews

const db = require("../db");

exports.getPlaces = (callback) => {
  const sql = "SELECT * FROM places ORDER BY id DESC";
  db.query(sql, callback);
};

exports.getPlace = (placeId, callback) => {
  const sql = "SELECT * FROM places WHERE id = ?";
  db.query(sql, [placeId], callback);
};

// Get reviews with user emails
exports.getReviews = (placeId, callback) => {
  const sql = `
    SELECT place_reviews.*, users.email
    FROM place_reviews
    JOIN users ON users.id = place_reviews.user_id
    WHERE place_id = ?
    ORDER BY created_at ASC
  `;
  db.query(sql, [placeId], callback);
};

exports.addPlace = (
  name,
  category,
  description,
  image,
  createdBy,
  locationUrl,
  callback
) => {
  const sql = `
    INSERT INTO places (name, category, description, image, created_by, location_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [name, category, description, image, createdBy, locationUrl],
    callback
  );
};

exports.addReview = (placeId, userId, text, callback) => {
  const sql = `
    INSERT INTO place_reviews (place_id, user_id, text)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [placeId, userId, text], callback);
};

// Only delete if user owns the place
exports.deletePlace = (placeId, userId, callback) => {
  const sql = `
    DELETE FROM places
    WHERE id = ? AND created_by = ?
  `;
  db.query(sql, [placeId, userId], callback);
};
