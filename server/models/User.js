const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,        // prevents duplicate register
    lowercase: true
  },

  password: { type: String, required: true },

  token: { type: String, default: null } //  single login control

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);