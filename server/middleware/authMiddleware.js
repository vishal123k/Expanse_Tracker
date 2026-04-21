const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Token verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // select('-password') use kiya taaki req.user mein password na aaye
      const user = await User.findById(decoded.id).select("-password");

      // check if token is valid session (Single Device Login)
      if (!user || user.token !== token) {
        return res.status(401).json({
          message: "Session expired or logged in from another device. Please login again."
        });
      }

      req.user = user;
      return next(); // return next() is safer

    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // Agar token header mein tha hi nahi
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;