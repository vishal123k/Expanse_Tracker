const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // CRITICAL: Since we set `select: false` on the token in the User model, 
      // we MUST use `.select('+token')` here to retrieve it for comparison.
      const user = await User.findById(decoded.id).select("+token");

      if (!user) {
        return res.status(401).json({ message: "Not authorized, user no longer exists." });
      }

      // Enforce Single Device Login
      if (user.token !== token) {
        return res.status(401).json({
          message: "Session expired or logged in from another device. Please login again."
        });
      }

      // Attach user to the request object so controllers can use it
      req.user = user;
      return next();

    } catch (error) {
      console.error("Auth Error:", error.message);
      
      // Give the frontend specific context on why auth failed
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your session has expired. Please log in again." });
      }
      
      return res.status(401).json({ message: "Not authorized, token validation failed." });
    }
  }

  // If no token was found in the headers at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

module.exports = protect;