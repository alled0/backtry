const express = require('express');
const clubController = require('../controllers/clubController'); // Adjust the path as necessary

const router = express.Router();

router.post('/', clubController.createClub); // Create a new club
router.get('/', clubController.getAllClubs); // Get all clubs
router.get('/:id', clubController.getClubById); // Get club by ID
router.put('/:id', clubController.updateClub); // Update club by ID
router.delete('/:id', clubController.deleteClub); // Delete club by ID

module.exports = router;