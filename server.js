// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js"); // Fix typo
const connection = require("./config/db.js");

dotenv.config(); // Load environment variables

connection(); // Establish DB connection

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Use the routes
app.use("/api/userRoutes", userRoutes);
app.use("/api/authRoutes", authRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

