// user controller
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// signup user
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const results = await User.findByEmail(email);
    if (results && results.length > 0) {
      return res.status(400).send('email already used');
    }

    // hash pass
    const hashed = await bcrypt.hash(password, 10);

    // save user
    await User.createUser(email, hashed);
    res.send('user created');
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).send('signup error');
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const results = await User.findByEmail(email);
    const user = results && results[0];
    if (!user) return res.status(401).send('wrong email');

    // compare passwords
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send('wrong pass');

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).send('login error');
  }
};

// get user by id
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).send("user not found");
    }

    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).send("error loading user");
  }
};

// update profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId, profileImageUrl, bio } = req.body;

    if (!userId) {
      return res.status(400).send("missing user id");
    }

    await User.updateUserProfile(
      userId,
      profileImageUrl || null,
      bio || null
    );
    res.send("profile updated");
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).send("error updating profile");
  }
};

