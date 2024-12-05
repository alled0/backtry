const Joi = require("joi");

// Define the email regex: yxxxxxxxxx@kfupm.edu.sa
const emailRegex = /^[A-Za-z]\d{9}@kfupm\.edu\.sa$/;

// Sign-Up Validation Schema
const signUpSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string()
      .pattern(emailRegex)
      .required()
      .messages({
        "string.pattern.base": "Email must be in the format yxxxxxxxxx@kfupm.edu.sa",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      })
      .label("Email"),
    password: Joi.string().min(6).required().label("Password"),
    role: Joi.string().valid("normal", "admin", "clubAccount").required().label("Role"),
  });
  

// Log-In Validation Schema
const logInSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({
      "string.pattern.base": "Email must be in the format yxxxxxxxxx@kfupm.edu.sa",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    })
    .label("Email"),
  password: Joi.string().min(6).required().label("Password"),
});

// Profile Update Validation Schema
const profileUpdateSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  profilePicture: Joi.string().optional(),
  interests: Joi.string().optional(),
  contactNumber: Joi.string().optional(),
  linkedIn: Joi.string().optional(),
  ID: Joi.string().optional(),
});

module.exports = { signUpSchema, logInSchema, profileUpdateSchema };
