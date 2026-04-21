const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// DB connect tabhi karo jab variables load ho jayein
connectDB(); 

const app = express();

// Pro-Tip for Production: CORS ko restrict karna safe hota hai
// app.use(cors({ origin: "http://localhost:3000" })); // Sirf apne frontend ko allow karein
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Global Error Handling Middleware (Hamesha routes ke end mein lagta hai)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    // Sirf development mein poori detail bhejein, production mein nahi
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Port Fallback: Agar .env mein PORT nahi hai toh 5000 use karo
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});