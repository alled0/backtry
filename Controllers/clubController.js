const Club = require('../models/clubModel'); // Adjust the path as necessary

// Create a new club
exports.createClub = async (req, res) => {
    try {
        const club = new Club(req.body);
        const savedClub = await club.save();
        res.status(201).json(savedClub);
    } catch (error) {
        res.status(400).json({ message: 'Error creating club', error });
    }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find().populate('createdBy', 'name email').populate('members', 'name email').populate('events', 'title date');
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving clubs', error });
    }
};

// Get a single club by ID
exports.getClubById = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email')
            .populate('events', 'title date');
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving club', error });
    }
};

// Update a club by ID
exports.updateClub = async (req, res) => {
    try {
        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedClub) return res.status(404).json({ message: 'Club not found' });
        res.status(200).json(updatedClub);
    } catch (error) {
        res.status(400).json({ message: 'Error updating club', error });
    }
};

// Delete a club by ID
exports.deleteClub = async (req, res) => {
    try {
        const deletedClub = await Club.findByIdAndDelete(req.params.id);
        if (!deletedClub) return res.status(404).json({ message: 'Club not found' });
        res.status(200).json({ message: 'Club deleted successfully', deletedClub });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting club', error });
    }
};
