const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Explicit Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    // 5. Generate and assign token for single-login control
    const token = generateToken(user._id);
    user.token = token; 

    await user.save(); 

    // 6. Send clean response (Notice we include the 'name' for the UI)
    res.status(201).json({
      _id: user._id,
      name: user.name, 
      email: user.email,
      token
    });

  } catch (error) {
    console.error("Registration Error:", error); // Log real error for developer
    res.status(500).json({ message: "Server error during registration. Please try again." });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // CRITICAL: Because we used `select: false` in the model, we MUST use `.select('+password')` here
    const user = await User.findOne({ email }).select("+password");

    // Check user and password in one step for cleaner logic
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Overwrite old token -> enforces single active login
    const token = generateToken(user._id);
    user.token = token;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login. Please try again." });
  }
};