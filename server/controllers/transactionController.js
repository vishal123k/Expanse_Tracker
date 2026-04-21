const Transaction = require("../models/Transaction");

//ADD
exports.addTransaction = async (req, res) => {
  try {
    // Basic validation check
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Transaction data is missing" });
    }

    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET
exports.getTransactions = async (req, res) => {
  try {
    const data = await Transaction.find({ user: req.user._id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Pehle transaction find karein aur check karein ki wo logged-in user ki hi hai
    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    // 2. Agar mil jaye aur user same ho, tabhi delete karein
    await transaction.deleteOne();

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
};