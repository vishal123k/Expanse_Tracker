const Transaction = require("../models/Transaction");

// ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;

    // Explicit validation is safer than checking Object.keys length
    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Amount, type, and category are required." });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date: date || Date.now(),
      user: req.user._id // Extracted from your authentication middleware
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Add Transaction Error:", error);
    
    // Check if it's a Mongoose validation error (e.g., negative amount)
    if (error.name === "ValidationError") {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Server error while adding transaction." });
  }
};

// GET TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    // Let the Database handle the sorting (-1 means descending/newest first)
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ message: "Server error while fetching transactions." });
  }
};

// DELETE TRANSACTION
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // findOneAndDelete is an atomic operation: it finds and deletes in a single DB query
    const transaction = await Transaction.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized." });
    }

    res.status(200).json({ 
      message: "Transaction deleted successfully",
      deletedId: id 
    });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    res.status(500).json({ message: "Server error while deleting transaction." });
  }
};