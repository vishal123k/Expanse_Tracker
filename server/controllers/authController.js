const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

//  REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);
    user.token = token; // Add token before saving

    await user.save(); 

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate email" });
    }
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user._id);

      //  overwrite old token → single login only
      user.token = token;
      await user.save();

      res.status(200).json({
        _id: user._id,
        email: user.email,
        token
      });

    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};