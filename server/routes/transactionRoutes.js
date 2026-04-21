const express = require("express");
const {
  addTransaction,
  getTransactions,
  deleteTransaction
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 🛡️ GLOBAL MIDDLEWARE FOR THIS ROUTER
// Applies the 'protect' middleware to ALL routes below this line.
// This is much cleaner than writing 'protect' on every single route!
router.use(protect);

/**
 * @route   /api/transactions
 * @desc    GET: Fetch logged-in user's transactions
 * POST: Create a new transaction
 * @access  Private
 */
router.route("/")
  .get(getTransactions)
  .post(addTransaction);

/**
 * @route   /api/transactions/:id
 * @desc    DELETE: Remove a specific transaction
 * @access  Private
 */
router.route("/:id")
  .delete(deleteTransaction);

module.exports = router;