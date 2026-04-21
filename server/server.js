const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const connectDB = require("./config/db");

// Load environment variables early
dotenv.config();

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE
// ==========================================

// Security Headers: Protects against well-known web vulnerabilities
app.use(helmet());

// Logging: Shows HTTP requests in the console (great for debugging)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS Configuration: Controls who can access your API
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allows cookies/headers to be sent back and forth
  })
);

// Body Parser: Allows Express to read JSON data from req.body
app.use(express.json());


// ==========================================
// 2. MOUNT ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Expense Tracker API is running smoothly." });
});


// ==========================================
// 3. ERROR HANDLING MIDDLEWARE
// ==========================================

// Catch 404 (Not Found): If a route doesn't match anything above
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the global handler below
});

// Global Error Handler
app.use((err, req, res, next) => {
  // If status code is 200 but it's an error, force it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // Only leak the stack trace if we are in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});


// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================

const PORT = process.env.PORT || 5000;

// Best Practice: Connect to Database FIRST, then start the server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection issue.");
    process.exit(1);
  }
};

startServer();