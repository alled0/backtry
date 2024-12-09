const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { validateReservation } = require("../validationSchemas");

// Route to create a reservation
router.post("/", validateReservation, reservationController.createReservation);

module.exports = router;

