//routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { User, validate } = require("../models/User"); // Ensure correct imports
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');  // Adjust the path as needed

// Sign-Up route
router.post("/Sign-Up", async (req, res) => {
  try {
    // Validate the incoming user data using Joi schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ message: "User with this email already exists" });
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await user.save();

    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Sign-up error:", error); // Log the error for debugging
    res.status(500).send({ message: "Server error" });
  }
});

router.put("/Your-Profile", authenticateToken, async (req, res) => {
  const userId = req.user._id;  // Extract user ID from the JWT token

  const { name, profilePicture, interests, role, contactNumber, linkedIn,ID } = req.body;

  // Ensure the name is provided
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // Find the user by ID and update their profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided, otherwise keep old values
    user.name = name || user.name;
    user.profilePicture = profilePicture || user.profilePicture;
    user.interests = interests || user.interests;
    user.role = role || user.role;
    user.contactNumber = contactNumber || user.contactNumber;
    user.linkedIn = linkedIn || user.linkedIn;
    user.ID = ID || user.ID;

    // Save updated user data
    await user.save();

    // Respond with updated data
    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        interests: user.interests,
        contactNumber: user.contactNumber,
        linkedIn: user.linkedIn,
        ID:user.ID,
      }
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});
router.get("/Your-Profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;  // Extract user ID from the token

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the user data (excluding sensitive information like password)
    res.status(200).json({
      message: "User profile fetched successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        interests: user.interests,
        contactNumber: user.contactNumber,
        linkedIn: user.linkedIn,
        ID:user.ID,
        
      }
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
});
module.exports = router;
