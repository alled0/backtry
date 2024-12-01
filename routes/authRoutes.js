// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const Joi = require("joi");
const router = express.Router();

// Login route
router.post("/Log-In", async (req, res) => {
  try {
    // Validate login input (email and password only)
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return the token and a success message
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error); // Log the error to the console for debugging
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
