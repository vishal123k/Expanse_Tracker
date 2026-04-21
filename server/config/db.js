const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log the host to confirm which database environment we are connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Kill the Node.js process if DB connection fails.
    // It is dangerous to run a backend app that has no database.
    process.exit(1); 
  }
};

module.exports = connectDB;