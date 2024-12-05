const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const participantController = require("../controllers/participantController");

// Reservation routes
router.post("/", reservationController.createReservation); // Create a reservation
router.get("/", reservationController.getReservations); // Get all reservations
router.get("/:id", reservationController.getReservationById); // Get a specific reservation by ID
router.put("/:id", reservationController.updateReservation); // Update a reservation
router.delete("/:id", reservationController.deleteReservation); // Delete a reservation

// Participant routes
router.post("/participants", participantController.addParticipant); // Add a participant
router.delete("/participants/:reservationId/:participantId", participantController.removeParticipant); // Remove a participant
router.get("/participants/:reservationId", participantController.getParticipants); // Get participants for a reservation

module.exports = router;
