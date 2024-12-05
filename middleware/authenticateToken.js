

// // authenticateToken.js
// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract the token

//   if (!token) {
//     return res.status(403).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     // Decode the token using the secret key
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Ensure correct JWT secret here
//     req.user = decoded;  // Attach user data to the request object
//     next();  // Pass control to the next middleware/route handler
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token.' });
//   }
// };









// module.exports = authenticateToken;
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = decoded;  // Attach decoded user data to the request
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
module.exports = authenticateToken;






