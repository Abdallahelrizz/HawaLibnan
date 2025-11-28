// Place controller - handles HTTP requests for places

const Place = require("../models/placeModel");

// GET /api/places
exports.getPlaces = (req, res) => {
  Place.getPlaces((err, results) => {
    if (err) {
      console.error("getPlaces error:", err);
      return res.status(500).send("error loading places");
    }
    res.json(results);
  });
};

// GET /api/places/:id
// Returns { place, reviews }
exports.getPlace = (req, res) => {
  const id = req.params.id;

  Place.getPlace(id, (err, placeRows) => {
    if (err) {
      console.error("getPlace error:", err);
      return res.status(500).send("error loading place");
    }
    if (!placeRows.length) {
      return res.status(404).send("place not found");
    }

    const place = placeRows[0];

    Place.getReviews(id, (err2, reviewRows) => {
      if (err2) {
        console.error("getReviews error:", err2);
        return res.status(500).send("error loading reviews");
      }

      res.json({
        place,
        reviews: reviewRows,
      });
    });
  });
};

// POST /api/places
// Body: { name, category, description, image, user_id, location_url }
exports.addPlace = (req, res) => {
  const { name, category, description, image, user_id, location_url } = req.body;

  if (!user_id) {
    return res.status(401).send("login required");
  }

  if (!name || !category || !image || !location_url) {
    return res.status(400).send("missing required fields");
  }

  Place.addPlace(
    name,
    category,
    description || "",
    image,
    user_id,
    location_url,
    (err) => {
    if (err) {
      console.error("addPlace error:", err);
      return res.status(500).send("error adding place");
    }
    res.send("place added");
    }
  );
};

// POST /api/places/review
// Body: { place_id, user_id, text }
exports.addReview = (req, res) => {
  const { place_id, user_id, text } = req.body;

  if (!place_id || !user_id || !text) {
    return res.status(400).send("missing review data");
  }

  Place.addReview(place_id, user_id, text, (err) => {
    if (err) {
      console.error("addReview error:", err);
      return res.status(500).send("error adding review");
    }
    res.send("review added");
  });
};

// DELETE /api/places/:id
// Body: { user_id }
exports.deletePlace = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(401).send("login required");
  }

  Place.deletePlace(id, user_id, (err, result) => {
    if (err) {
      console.error("deletePlace error:", err);
      return res.status(500).send("error deleting place");
    }

    if (result.affectedRows === 0) {
      return res.status(403).send("place not found or access denied");
    }

    res.send("place deleted");
  });
};
