const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addTransaction,
  getTransactions,
  deleteTransaction // Import the new controller function
} = require("../controllers/transactionController");

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);

// Protect middleware lagaya aur logic controller mein bhej diya
router.delete("/:id", protect, deleteTransaction); 

module.exports = router;