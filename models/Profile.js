
// const mongoose = require("mongoose");
// const User = require("./User.js");


// const profileSchema = new mongoose.Schema({

//     profilePicture: { type: String, default: "" },
//     interests: { type: String, default: "" },
//     contactNumber: { type: String, default: "" },
//     linkedIn: { type: String, default: "" },
//     // Add more fields as necessary
  
//   })


//   // Joi validation for user profile update data
// const validateProfileUpdate = (data) => {
//     const schema = Joi.object({
//       name: Joi.string().optional(),
//       email: Joi.string().email().optional(),
//       profilePicture: Joi.string().optional(),
//       interests: Joi.string().optional(),
//       contactNumber: Joi.string().optional(),
//       linkedIn: Joi.string().optional(),
//       // Add more fields if needed
//     });
//     return schema.validate(data);
//   };



// const profile = mongoose.model("profile", profileSchema);

// module.exports = { profile, validateProfileUpdate};
