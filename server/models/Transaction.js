const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must belong to a user"],
      index: true // Performance: Speeds up finding all transactions for a specific user
    },
    amount: { 
      type: Number, 
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"]
    },
    type: { 
      type: String, 
      enum: {
        values: ["income", "expense"],
        message: "{VALUE} is not a valid transaction type" // {VALUE} dynamically shows what the user sent
      }, 
      required: [true, "Transaction type is required"] 
    },
    category: { 
      type: String, 
      required: [true, "Category is required"],
      trim: true,
      lowercase: true // Normalizes data (e.g., 'Food' and 'food' are saved exactly the same)
    },
    date: { 
      type: Date, 
      default: Date.now,
      index: true // Performance: Speeds up sorting transactions by date
    }
  }, 
  { timestamps: true }
);

// Compound Index: Optimizes the exact query your dashboard uses (Fetching a user's transactions, sorted by newest date)
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);