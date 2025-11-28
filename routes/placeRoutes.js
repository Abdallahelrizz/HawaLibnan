// placeRoutes.js
// Routes for places & their reviews

const express = require("express");
const router = express.Router();
const controller = require("../controllers/placeController");

// GET all places
router.get("/", controller.getPlaces);

// GET single place + reviews
router.get("/:id", controller.getPlace);

// Add place
router.post("/", controller.addPlace);

// Add review
router.post("/review", controller.addReview);

// Delete place
router.delete("/:id", controller.deletePlace);

module.exports = router;