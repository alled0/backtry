const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
  // Profile-related fields directly in the User schema
  profilePicture: { type: String, default: "" },
  interests: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  ID: { type: String, default: "443" },
  // Add more fields as necessary
  // profileData: {
  //   type: Object,
  //   default: {},
  // },
  // preferences: {
  //   type: Object,
  //   default: {},
  // },
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

// Joi validation for user sign-up data
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("Student", "Admin").required().label("Role"),
  });
  return schema.validate(data);
};

// Joi validation for user profile update data
const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    profilePicture: Joi.string().optional(),
    interests: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    linkedIn: Joi.string().optional(),
    ID:Joi.String().optional(),
    // Add more fields if needed
  });
  return schema.validate(data);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validate, validateProfileUpdate };


