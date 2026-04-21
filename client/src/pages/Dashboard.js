import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/transactions");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTransaction = async (form) => {
    try {
      await API.post("/transactions", form);
      fetchData();
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  // Calculate Summary
  const income = data
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const expense = data
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
    
  const balance = income - expense;

  // Prepare Data for Pie Chart (Grouping expenses by category)
  const expensesByCategory = data
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const existingCategory = acc.find((item) => item.name === curr.category);
      if (existingCategory) {
        existingCategory.value += Number(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Number(curr.amount) });
      }
      return acc;
    }, []);

  // Colors for the Pie Chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />

      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-blue-500">
            <h4 className="text-gray-500 text-sm">Total Balance</h4>
            <p className="text-xl font-bold">₹{balance}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-green-500">
            <h4 className="text-gray-500 text-sm">Total Income</h4>
            <p className="text-xl font-bold text-green-600">₹{income}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-red-500">
            <h4 className="text-gray-500 text-sm">Total Expense</h4>
            <p className="text-xl font-bold text-red-600">₹{expense}</p>
          </div>
        </div>

        {/* Chart Section (Sirf tabhi dikhega jab expenses honge) */}
        {expensesByCategory.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow mb-6 h-[350px]">
            <h3 className="text-lg font-semibold mb-2 text-center">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Forms and List */}
        <TransactionForm onAdd={addTransaction} />
        <TransactionList data={data} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}

export default Dashboard;