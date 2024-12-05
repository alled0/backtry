// Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db.js");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js"); // Fix typo
const reservationRoute = require("./routes/reservationRoute.js");
const eventRoutes = require("./routes/eventRoute.js");
const clubRoutes = require("./routes/clubRoute.js");


dotenv.config(); // Load environment variables


const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Use the routes
app.use("/api/userRoutes", userRoutes);
app.use("/api/authRoutes", authRoutes);
app.use("/api/eventRoute", eventRoutes)
app.use("/api/clubRoute", clubRoutes)
app.use("/api/reservationRoute", reservationRoute);



const PORT = process.env.PORT || 5000;

try {
  connection()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection error:", error.message);
}
