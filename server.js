// Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db.js");
const cron = require("node-cron");
const Reservation = require("./models/Reservation"); // Update the path if necessary

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const reservationRoute = require("./routes/reservationRoute.js");
const eventRoutes = require("./routes/eventRoute.js");
const clubRoutes = require("./routes/clubRoute.js");
const otpRoutes = require("./routes/otpRoutes.js");

dotenv.config(); // Load environment variables

const app = express();
app.option('*',cors());
app.use(cors({
  origin: "https://kfupm-hup.onrender.com", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allow these headers

  credentials: true // If you're using cookies or authentication headers
}));

app.use(express.json()); // Middleware to parse JSON requests

// Use the routes
app.use("/api/userRoutes", userRoutes);
app.use("/api/authRoutes", authRoutes);
app.use("/api/eventRoute", eventRoutes);
app.use("/api/clubRoute", clubRoutes);
app.use("/api/reservationRoute", reservationRoute);
app.use("/api/otpRoutes", otpRoutes);

const path = require("path");


const PORT = process.env.PORT || 4000;

try {
  connection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection error:", error.message);
}
