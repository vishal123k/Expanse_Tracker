import { useState } from "react";

function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    setError(""); // Clear previous errors

    const amountValue = Number(form.amount);
    
    // Consolidated and improved validation
    if (!form.amount || !form.category.trim() || !form.date) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (amountValue <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    // Pass data to parent
    onAdd({ ...form, amount: amountValue, category: form.category.trim() });
    
    // Reset form
    setForm({
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Base styling for all inputs to ensure consistency
  const inputStyles = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200";
  
  // Dynamic focus ring color based on transaction type
  const focusRingColor = form.type === "income" ? "focus:ring-emerald-500" : "focus:ring-rose-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Inline Error Message */}
      {error && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            step="any"
            className={`${inputStyles} ${focusRingColor} pl-8`}
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            aria-label="Amount"
          />
        </div>

        {/* Type Select */}
        <select
          className={`${inputStyles} ${focusRingColor} cursor-pointer appearance-none`}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          aria-label="Transaction Type"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Category Input */}
        <input
          type="text"
          className={`${inputStyles} ${focusRingColor}`}
          placeholder="Category (e.g., Food, Salary)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          aria-label="Category"
        />

        {/* Date Input */}
        <input
          type="date"
          className={`${inputStyles} ${focusRingColor} text-slate-600`}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          aria-label="Date"
        />
      </div>

      {/* Dynamic Submit Button */}
      <button
        type="submit"
        className={`w-full py-2.5 px-4 text-white font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          form.type === "income"
            ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
        }`}
      >
        Add {form.type === "income" ? "Income" : "Expense"}
      </button>
    </form>
  );
}

export default TransactionForm;