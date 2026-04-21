import { useState } from "react";

function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const handleSubmit = () => {
    const amountValue = Number(form.amount);
    if (!form.amount || !form.category || !form.date) {
      alert("Please fill all fields");
      return;
    }
    if (!form.amount || !form.category || !form.date || amountValue <= 0) {
      alert("Please fill all fields correctly. Amount must be greater than 0.");
      return;
    }

    // onAdd ko call karte waqt converted number pass karein
    onAdd({ ...form, amount: amountValue });
    setForm({
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Add Transaction</h3>

      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          className="border p-2 rounded w-28"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          className="border p-2 rounded flex-grow min-w-[150px]"
          placeholder="Category (e.g., Food, Salary)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TransactionForm;
