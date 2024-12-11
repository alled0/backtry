const express = require("express");
const {
  signUp,
  updateProfile,
  fetchProfile,
  adminRoute,
  clubRoute,
  followClub,
  unfollowClub,
  joinEvent,
  leaveEvent,
  getEnrolledClubs,
  getFollowedClubs,
  getJoinedEvents,
} = require("../Controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const { getUserWithReservations } = require("../Controllers/userController");

const router = express.Router();

// Sign-Up route
router.post("/sign-Up", signUp);

// Update Profile route
router.put("/profile", authenticateToken, updateProfile);

// Fetch Profile route
router.get("/profile", authenticateToken, fetchProfile);

// Admin-only route
router.get(
  "/admin-only",
  authenticateToken,
  authorizeRoles("admin"),
  adminRoute
);

// Club-only route
router.get(
  "/club-only",
  authenticateToken,
  authorizeRoles("clubAccount"),
  clubRoute
);

// Follow/Unfollow Club
router.post("/follow-club", authenticateToken, followClub);
router.post("/unfollow-club", authenticateToken, unfollowClub);

// Join/Leave Event
router.post("/join-event", authenticateToken, joinEvent);
router.post("/leave-event", authenticateToken, leaveEvent);

// Get Enrolled Clubs
router.get("/enrolled-clubs", authenticateToken, getEnrolledClubs);

// Get Followed Clubs
router.get("/followed-clubs", authenticateToken, getFollowedClubs);

// Get Joined Events
router.get("/joined-events", authenticateToken, getJoinedEvents);


module.exports = router;
