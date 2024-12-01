//db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
MONGODB_URI="mongodb+srv://alledcss:Ww1234@cluster0.oc4ph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// models/User.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Student", "Admin"],
    required: true,
  },
  // Add user-specific fields
  profileData: {
    type: Object,
    default: {},
  },
  preferences: {
    type: Object,
    default: {},
  },
  // Additional fields you want to store can go here
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "1h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("First Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };

// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from headers
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
    req.user = decoded; // Attach the decoded token (user info) to the request
    next(); // Call the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;

// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const Joi = require("joi");
const router = express.Router();

// Login route
router.post("/Log-In", async (req, res) => {
  try {
    // Validate login input (email and password only)
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error); // Log the error to the console for debugging
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;


// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Route to update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assumes user is authenticated
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'Profile updated successfully', data: user });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

// Route to fetch user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assumes user is authenticated
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ data: user });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

module.exports = router;




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // Correct import
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

connectDB(); // Establish DB connection

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Use the routes
app.use("/api/authRoutes", authRoutes); // Handling login routes
app.use("/api/userRoutes", userRoutes); // Handling user profile routes

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



this is the my project backend

i will send you the frontend after  

// src/pages/YourProfile.js
import { useState, useEffect } from "react";
import axios from "axios";
import Body from "../components/Body";
import "../styles/main.css";
import "../styles/master.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { NormInput } from "../components/Inputs";
import { Uplode } from "../components/Inputs";
import { Link } from "../components/Inputs";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const YourProfile = () => {
  const [inputs, setInputs] = useState({
    name: "",
    profilePicture: "No file chosen",
    interests: "",
    role: "",
    email: "",
    changePassword: "",
    contactNumber: "",
    linkedIn: "",
    id: "",
  });

  const [initialValues, setInitialValues] = useState(null);  // Store initial form data
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        // Fetch profile data from the API
        const response = await axios.get("http://localhost:5000/api/userRoutes/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        // Save initial data so we can reset the form to it
        setInitialValues(response.data.data);
        setInputs(response.data.data);  // Set the form data

      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = ({ currentTarget: input }) => {
    setInputs({ ...inputs, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset any previous errors

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first.");
        return;
      }

      // Update the profile
      const response = await axios.put("http://localhost:5000/api/userRoutes/profile", inputs, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Check if the response is successful
      if (response.status === 200) {
        alert("Profile updated successfully!");  // Success message
        navigate("/home");  // Redirect to the home page
      }
    } catch (err) {
      setError("Failed to update profile.");
      console.error("Error submitting profile data:", err.response || err);
    }
  };

  const handleCancel = () => {
    if (initialValues) {
      setInputs(initialValues);  // Reset form to initial values
    }
    navigate("/home");  // Redirect to the home page without saving any changes
  };

  // Loading spinner or message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Body>
      <div className="body">
        <h1>Your Profile</h1>
        {error && <div className="error">{error}</div>} {/* Show error message if any */}

        <Row className={"g-4 wid-row"} md={2} sm={1} xs={1}>
          <Col>
            <div className="wid-colum">
              <Form className="form" onSubmit={handleSubmit}>
                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"name"}
                  type={"text"}
                  label={"Name"}
                  placeholder={"Enter your name"}
                  onChange={handleInputChange}
                />

                <Uplode
                  setInputs={setInputs}
                  inputs={inputs}
                  input={"profilePicture"}
                  label={"Profile Picture"}
                  onChange={handleInputChange}
                />

                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"interests"}
                  type={"text"}
                  label={"Interests"}
                  placeholder={"e.g., football, research"}
                  onChange={handleInputChange}
                />

                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"role"}
                  type={"text"}
                  label={"Role"}
                  placeholder={"e.g., Student, Club Leader"}
                  onChange={handleInputChange}
                />
              </Form>
            </div>
          </Col>
          <Col>
            <div className="wid-colum">
              <Form className="form" onSubmit={handleSubmit}>
                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"email"}
                  type={"email"}
                  label={"Change Email"}
                  placeholder={"Enter your new email"}
                  onChange={handleInputChange}
                />

                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"changePassword"}
                  type={"password"}
                  label={"Change Password"}
                  placeholder={"Enter new password"}
                  onChange={handleInputChange}
                />

                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"contactNumber"}
                  type={"text"}
                  label={"Contact Number"}
                  placeholder={"Enter contact number"}
                  onChange={handleInputChange}
                />

                <NormInput
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"linkedIn"}
                  type={"text"}
                  label={"LinkedIn"}
                  placeholder={"Enter LinkedIn ID"}
                  onChange={handleInputChange}
                />

                <Link
                  inputs={inputs}
                  setInputs={setInputs}
                  input={"id"}
                  type={"text"}
                  label={"ID"}
                  placeholder={"User ID"}
                  onChange={handleInputChange}
                />
              </Form>

              <div className="form">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "20px",
                    marginTop: "50px",
                  }}
                >
                  <Button
                    className={"inputs-btn back"}
                    as="input"
                    type="button"
                    value="Cancel"
                    onClick={handleCancel}  // Redirect to the home page without saving
                  />
                  <Button
                    className="inputs-btn"
                    as="input"
                    type="submit"
                    value="Save"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Body>
  );
};

export default YourProfile;



import "./App.css";
import "./styles/main.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import { Suspense } from "react";

import CreateActivity from "./pages/CreateActivity";
import ManageProfile from "./pages/ManageProfile";
import YourProfile from "./pages/YourProfile";

import LogIn from "./pages/LogIn";
import LogOut from "./pages/LogOut.js"
import SignUp from "./pages/SignUp";
import NewClub from "./pages/NewClub";
import SportsReserve from "./pages/SportsReserve";
import NewReservation from "./pages/NewReservation";
import ReservationSuccess from "./pages/ReservationSuccess";
import ReservationDetails from "./pages/ReservationDetails";
import LatestNews from "./pages/LatestNews";
import EditActivity from "./pages/EditActivity";
import NewsAndClubs from "./pages/NewsAndClubs";
import ActivityView from "./pages/ActivityView";
import ClubMembers from "./pages/ClubMembers";
import ClubProfile from "./pages/ClubProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import MemberProfile from "./pages/MemberProfile";
import Clubs from "./pages/Clubs";
import EditClub from "./pages/EditClub";
import ErrorPage from "./pages/ErrorPage";
import LoadingPage from "./pages/LoadingPage";
import ClLeadHomePage from "./pages/ClLeadHomePage";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route>
            <Route index element={<LogIn />} />
            {/*{frame 18}*/}

            <Route path="home" element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<ErrorPage />} />

            <Route path="Create-Activity-news" element={<CreateActivity />} />
            {/*{frame 13}*/}

            <Route path="Manage-Profile" element={<ManageProfile />} />
            {/*{frame 14}*/}

            <Route path="Your-Profile" element={<YourProfile />} />
            {/*{frame 20}*/}

            <Route path="Sign-Up" element={<SignUp />} />
            {/*{frame 19}*/}

            <Route path="Log-In" element={<LogIn />} />
            {/*{frame 19}*/}

            <Route path="/LogOut" element={<LogOut />} />


            <Route path="New-Club" element={<NewClub />} />
            {/*{frame 22}*/}

            <Route path="Sports-reservation" element={<SportsReserve />} />
            {/*{frame 22}*/}

            <Route path="Latest-News" element={<LatestNews />} />
            {/*{frame 8}*/}

            <Route path="edit-Activity" element={<EditActivity />} />
            {/*{frame 15}*/}

            <Route path="new-reservation" element={<NewReservation />} />
            {/*{frame 3}*/}

            <Route path="reservaion-success" element={<ReservationSuccess />} />
            {/*{frame 4}*/}

            <Route path="news-clubs" element={<NewsAndClubs />} />
            {/*{frame 7}*/}

            <Route path="activity-view" element={<ActivityView />} />
            {/*{frame 7}*/}

            <Route
              path="/reservation-details"
              element={<ReservationDetails />}
            />
            {/*{frame 5&6}*/}

            <Route path="/club-members" element={<ClubMembers />} />
            {/*{frame 16}*/}

            <Route path="/member-profile" element={<MemberProfile />} />
            {/*{frame 17}*/}

            <Route path="/clubs" element={<Clubs />} />
            {/*{frame 21}*/}

            <Route path="/edit-club" element={<EditClub />} />
            {/*{frame 23}*/}

            <Route path="/error" element={<ErrorPage />} />
            {/*{frame 24}*/}

            <Route path="/club-profile" element={<ClubProfile />} />
            {/*{frame 11}*/}

            <Route path="/loading" element={<LoadingPage />} />
            {/*{frame 25}*/}

            <Route path={"/clubleaderHomePage"} element={<ClLeadHomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


//Nav.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";  // Make sure to use Link for routing

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status
  const navigate = useNavigate();  // For navigation

  // Check if the user is logged in by looking for an auth token
  useEffect(() => {
    const token = localStorage.getItem("authToken");  // Retrieve auth token from localStorage
    setIsLoggedIn(!!token);  // If token exists, user is logged in
  }, [localStorage.getItem("authToken")]);  // Depend on the token change

  const handleLogout = () => {
    // Remove the auth token and update the state
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);  // Update the logged-in state
    navigate("/login");  // Redirect user to the login page after logout
  };

  // Links for navigation, you can easily update this list as needed
  const linksList = [
    { key: 0, name: "Home", icon: faHouse, link: "/home" },
    { key: 1, name: "Create Activity News", icon: faHouse, link: "/Create-Activity-news" },
    { key: 2, name: "Manage Profile", icon: faHouse, link: "/Manage-Profile" },
    { key: 3, name: "Your Profile", icon: faHouse, link: "/Your-Profile" },
    { key: 4, name: "Login", icon: faHouse, link: "/login" },
    { key: 5, name: "Sign Up", icon: faHouse, link: "/Sign-Up" },
    { key: 6, name: "New Club", icon: faHouse, link: "/New-Club" },
    { key: 7, name: "Sports Reservation", icon: faHouse, link: "/Sports-reservation" },
    { key: 8, name: "Latest News", icon: faHouse, link: "/Latest-News" },
    { key: 9, name: "Edit Activity", icon: faHouse, link: "/edit-Activity" },
    { key: 10, name: "New Reservation", icon: faHouse, link: "/new-reservation" },
    { key: 11, name: "Reservation Success", icon: faHouse, link: "/reservaion-success" },
    { key: 12, name: "News Clubs", icon: faHouse, link: "/news-clubs" },
    { key: 13, name: "Activity View", icon: faHouse, link: "/activity-view" },
    { key: 14, name: "Reservation Details", icon: faHouse, link: "/reservation-details" },
    { key: 15, name: "Club Members", icon: faHouse, link: "/club-members" },
    { key: 16, name: "Member Profile", icon: faHouse, link: "/members-profile" },
    { key: 17, name: "Clubs", icon: faHouse, link: "/clubs" },
    { key: 18, name: "Edit Club", icon: faHouse, link: "/edit-club" },
    { key: 19, name: "Error", icon: faHouse, link: "/error" },
    { key: 20, name: "Club Profile", icon: faHouse, link: "/club-profile" },
    { key: 21, name: "Loading", icon: faHouse, link: "/loading" },
    { key: 22, name: "Club Leader Home Page", icon: faHouse, link: "/clubleaderHomePage" },
  ];

  // Render the navigation links
  const linkMap = linksList.map((nav) => {
    return (
      <Link key={nav.key} to={nav.link} className="link">
        <FontAwesomeIcon icon={nav.icon} size="1x" />
        <span>{nav.name}</span>
      </Link>
    );
  });

  return (
    <div className="navLinks">
      {linkMap}

      {/* Only show logout button if user is logged in */}
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size="1x" />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
}

// give the full version of the codes, keep the style 
// fix the buttons (cancel and save), connect the profile to real data when safe, each account should have its profile when login and if you suggest some features (not required), don't worry about the security at this stage 