const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    sport: { type: String, required: true, enum: ["Football", "Volleyball", "Basketball", "Tennis", "Badminton"] },
    court: { type: Number, required: true },
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v); // Exactly 4 digits
            },
            message: props => `${props.value} is not a valid 4-digit code!`
        }
    },
    type: { type: String, required: true, enum: ["Private", "Public"] },
    participants: {
        type: Number,
        required: true,
        default: 0, // Default value to 0 participants
        validate: {
            validator: function (v) {
                const maxParticipants = {
                    Football: 16,  // Example max values for different sports
                    Basketball: 10,
                    Volleyball: 12,
                    Tennis: 2,
                    Badminton: 4
                };
                return v <= (maxParticipants[this.sport] || 0); // Ensure value is within limits
            },
            message: props => `The number of participants exceeds the maximum allowed for ${props.instance.sport}.`
        }
    },
    time: { type: Date, required: true },
    date: { type: Date, required: true },
    timestamp: { type: Date, default: Date.now },
});


const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
