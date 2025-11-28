// user controller
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// signup user
exports.signup = (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  User.findByEmail(email, async (err, results) => {
    if (results && results.length > 0) {
      return res.status(400).send('email already used');
    }

    // hash pass
    const hashed = await bcrypt.hash(password, 10);

    // save user
    User.createUser(email, hashed, (err2) => {
      if (err2) return res.status(500).send('signup error');
      res.send('user created');
    });
  });
};

// login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // find user
  User.findByEmail(email, async (err, results) => {
    const user = results && results[0];
    if (!user) return res.status(401).send('wrong email');

    // compare passwords
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send('wrong pass');

    res.json({ id: user.id, email: user.email });
  });
};

// get user by id
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.getUserById(userId, (err, user) => {
    if (err) {
      console.error("getUserById error:", err);
      return res.status(500).send("error loading user");
    }

    if (!user) {
      return res.status(404).send("user not found");
    }

    res.json(user);
  });
};

// update profile
exports.updateUserProfile = (req, res) => {
  const { userId, profileImageUrl, bio } = req.body;

  if (!userId) {
    return res.status(400).send("missing user id");
  }

  User.updateUserProfile(
    userId,
    profileImageUrl || null,
    bio || null,
    (err, result) => {
      if (err) {
        console.error("updateUserProfile error:", err);
        return res.status(500).send("error updating profile");
      }
      res.send("profile updated");
    }
  );
};

