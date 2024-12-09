const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { validateReservation } = require("../validationSchemas");
const authenticateToken = require("../middleware/authenticateToken");

// Route to create a reservation (with token authentication)
router.post(
  "/",
  authenticateToken,
  validateReservation,
  reservationController.createReservation
);

module.exports = router;
