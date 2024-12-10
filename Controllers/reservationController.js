const Reservation = require("../models/Reservation");
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.createReservation = async (req, res) => {
  const { sport, field, type, date, time } = req.body;
  const userId = req.user._id; // Extracted from the token

  console.log("Logged-in user ID:", userId);

  try {
    // Validate required fields
    if (!sport || !field || !type || !date || !time) {
      return res.status(400).json({
        error:
          "Missing required fields. Please ensure all fields are provided.",
      });
    }

    // Check for duplicate reservations
    const existingReservation = await Reservation.findOne({
      sport,
      field,
      date: new Date(date),
      time,
    });

    if (existingReservation) {
      return res.status(400).json({
        error: "The field is already reserved for this time slot.",
      });
    }

    // Generate a unique code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Create and save the reservation
    const newReservation = new Reservation({
      createdBy: userId, // Associate with logged-in user
      sport,
      field,
      code,
      type,
      participants: 1,
      date: new Date(date),
      time,
    });

    await newReservation.save();
    console.log("Reservation created successfully:", newReservation);
    res.status(201).json(newReservation);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: "Server error creating reservation." });
  }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching reservation" });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { email, sport, field, type, date, time, participants } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { email, sport, field, type, date: new Date(date), time, participants },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating reservation" });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await Participant.deleteMany({ reservationId: id });

    res
      .status(200)
      .json({ message: "Reservation and its participants deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error deleting reservation" });
  }
};

// Fetch available time slots
exports.getAvailableTimeSlots = async (req, res) => {
  const { sport, field, date } = req.query;

  try {
    const formattedDate = new Date(date);
    const reservations = await Reservation.find({
      sport,
      field,
      date: formattedDate,
    });
    const reservedTimes = reservations.map((r) => r.time);

    // Define your default timeslots
    const allTimeSlots = [
      "10:00 - 11:00",
      "11:00 - 12:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
    ];
    const availableTimeSlots = allTimeSlots.filter(
      (slot) => !reservedTimes.includes(slot)
    );

    res.status(200).json({ availableTimeSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching time slots" });
  }
};

// Filter reservations
exports.getReservationsWithFilters = async (req, res) => {
  const { sport } = req.query;
  const filters = {};

  if (sport) filters.sport = sport;

  try {
    const reservations = await Reservation.find(filters);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations." });
  }
};

// Join a reservation
exports.joinReservation = async (req, res) => {
  const { id } = req.params;
  // Assume user email or ID comes from authenticated token or from req.body
  const { email } = req.body;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });

    // Increase participants by 1 (or handle max)
    // If you want to ensure no duplicates, you'd check if user already joined
    reservation.participants += 1;
    await reservation.save();
    res.status(200).json({ message: "Joined successfully", reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error joining reservation" });
  }
};
