const Reservation = require("../models/Reservation");
const Participant = require("../models/Participant");

// Create a new reservation
exports.createReservation = async (req, res) => {
    const { email, sport, court, code, type, participants, time, date } = req.body;

    // Validate input data
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }*/

    try {
        const newReservation = new Reservation({
            email,
            sport,
            court,
            code,
            type,
            participants,
            time,
            date
        });

        await newReservation.save();
        res.status(201).json(newReservation); // Return the created reservation
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all reservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
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
        res.status(500).json({ error: "Server error" });
    }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    const { email, sport, court, code, type, participants, time, date } = req.body;

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            {
                email,
                sport,
                court,
                code,
                type,
                participants,
                time,
                date
            },
            { new: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json(updatedReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
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

        // Optionally, delete all participants linked to this reservation
        await Participant.deleteMany({ reservationId: id });

        res.status(200).json({ message: "Reservation and its participants deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
