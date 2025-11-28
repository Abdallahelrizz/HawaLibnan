const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Signup
router.post("/signup", userController.signup);

// Login
router.post("/login", userController.login);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update profile (image + bio)
router.post("/updateProfile", userController.updateUserProfile);

module.exports = router;
