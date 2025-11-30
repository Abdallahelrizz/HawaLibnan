// Place controller - handles HTTP requests for places

const Place = require("../models/placeModel");

// GET /api/places
exports.getPlaces = async (req, res) => {
  try {
    const results = await Place.getPlaces();
    res.json(results);
  } catch (err) {
    console.error("getPlaces error:", err);
    res.status(500).send("error loading places");
  }
};

// GET /api/places/:id
// Returns { place, reviews }
exports.getPlace = async (req, res) => {
  try {
    const id = req.params.id;

    const placeRows = await Place.getPlace(id);
    if (!placeRows.length) {
      return res.status(404).send("place not found");
    }

    const place = placeRows[0];

    const reviewRows = await Place.getReviews(id);

    res.json({
      place,
      reviews: reviewRows,
    });
  } catch (err) {
    console.error("getPlace error:", err);
    res.status(500).send("error loading place");
  }
};

// POST /api/places
// Body: { name, category, description, image, user_id, location_url }
exports.addPlace = async (req, res) => {
  try {
    const { name, category, description, image, user_id, location_url } = req.body;

    if (!user_id) {
      return res.status(401).send("login required");
    }

    if (!name || !category || !image || !location_url) {
      return res.status(400).send("missing required fields");
    }

    await Place.addPlace(
      name,
      category,
      description || "",
      image,
      user_id,
      location_url
    );
    res.send("place added");
  } catch (err) {
    console.error("addPlace error:", err);
    res.status(500).send("error adding place");
  }
};

// POST /api/places/review
// Body: { place_id, user_id, text }
exports.addReview = async (req, res) => {
  try {
    const { place_id, user_id, text } = req.body;

    if (!place_id || !user_id || !text) {
      return res.status(400).send("missing review data");
    }

    await Place.addReview(place_id, user_id, text);
    res.send("review added");
  } catch (err) {
    console.error("addReview error:", err);
    res.status(500).send("error adding review");
  }
};

// DELETE /api/places/:id
// Body: { user_id }
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(401).send("login required");
    }

    const result = await Place.deletePlace(id, user_id);

    if (result.affectedRows === 0) {
      return res.status(403).send("place not found or access denied");
    }

    res.send("place deleted");
  } catch (err) {
    console.error("deletePlace error:", err);
    res.status(500).send("error deleting place");
  }
};
