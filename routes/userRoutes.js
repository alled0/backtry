// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { User, validate, validateProfileUpdate } = require("../models/User");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

const emailRegex = /^[a-zA-Z0-9._%+-]+@kfupm\.edu\.sa$/;

router.post("/Sign-Up", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate the user data
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check email format
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: "Please enter a valid email in the format Name/ID@kfupm.edu.sa.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User with this email already exists" });
    }

    
    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Now, no OTP is generated here. Just inform user to request OTP separately.
    res.status(201).send({
      message: "User registered successfully! Please request an OTP to verify your email.",
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;


// Update Profile route (accessible to authenticated users)
router.put("/Your-Profile", authenticateToken, async (req, res) => {
  const userId = req.user._id; // Extract user ID from the JWT token

  const { name, profilePicture, interests, contactNumber, linkedIn, ID } = req.body;

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
        profilePicture: user.profilePicture,
        interests: user.interests,
        contactNumber: user.contactNumber,
        linkedIn: user.linkedIn,
        ID: user.ID,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
});

// Fetch Profile route (accessible to authenticated users)
router.get("/Your-Profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the token

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
        profilePicture: user.profilePicture,
        interests: user.interests,
        contactNumber: user.contactNumber,
        linkedIn: user.linkedIn,
        ID: user.ID,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
});

// Example of a route only accessible by Admins
router.get("/admin-only-route", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
  // Your admin-specific logic here
  res.status(200).send({ message: "Welcome Admin!" });
});

// Example of a route only accessible by Club Accounts
router.get("/club-only-route", authenticateToken, authorizeRoles("clubAccount"), async (req, res) => {
  // Your clubAccount-specific logic here
  res.status(200).send({ message: "Welcome Club Account!" });
});

module.exports = router;

