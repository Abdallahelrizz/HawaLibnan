// Place model - database queries for places and reviews

const db = require("../db");

exports.getPlaces = async () => {
  const sql = "SELECT * FROM places ORDER BY id DESC";
  const [rows] = await db.query(sql);
  return rows;
};

exports.getPlace = async (placeId) => {
  const sql = "SELECT * FROM places WHERE id = ?";
  const [rows] = await db.query(sql, [placeId]);
  return rows;
};

// Get reviews with user emails
exports.getReviews = async (placeId) => {
  const sql = `
    SELECT place_reviews.*, users.email
    FROM place_reviews
    JOIN users ON users.id = place_reviews.user_id
    WHERE place_id = ?
    ORDER BY created_at ASC
  `;
  const [rows] = await db.query(sql, [placeId]);
  return rows;
};

exports.addPlace = async (
  name,
  category,
  description,
  image,
  createdBy,
  locationUrl
) => {
  const sql = `
    INSERT INTO places (name, category, description, image, created_by, location_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(
    sql,
    [name, category, description, image, createdBy, locationUrl]
  );
  return result;
};

exports.addReview = async (placeId, userId, text) => {
  const sql = `
    INSERT INTO place_reviews (place_id, user_id, text)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.query(sql, [placeId, userId, text]);
  return result;
};

// Only delete if user owns the place
exports.deletePlace = async (placeId, userId) => {
  const sql = `
    DELETE FROM places
    WHERE id = ? AND created_by = ?
  `;
  const [result] = await db.query(sql, [placeId, userId]);
  return result;
};
