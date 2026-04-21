import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Utility function for professional currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Modern, muted color palette for the chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API.get("/transactions");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
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
      alert("Failed to add transaction.");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction", error);
      alert("Failed to delete transaction.");
    }
  };

  // useMemo prevents recalculating these values on every render unless 'data' changes
  const { income, expense, balance } = useMemo(() => {
    const inc = data
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const exp = data
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [data]);

  const expensesByCategory = useMemo(() => {
    return data
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => {
        const existingCategory = acc.find((item) => item.name === curr.category);
        if (existingCategory) {
          existingCategory.value += Number(curr.amount);
        } else {
          acc.push({ name: curr.category, value: Number(curr.amount) });
        }
        return acc;
      }, [])
      .sort((a, b) => b.value - a.value); // Sort highest expenses first
  }, [data]);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-800">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <header className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Overview
          </h2>
        </header>

        {/* Loading & Error States */}
        {isLoading && <div className="text-slate-500 animate-pulse">Loading your financial data...</div>}
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200">{error}</div>}

        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Balance</h4>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>

              {/* Income Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Income</h4>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(income)}
                </p>
              </div>

              {/* Expense Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Expense</h4>
                <p className="text-2xl font-bold text-rose-600">
                  {formatCurrency(expense)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Breakdown</h3>
                
                {expensesByCategory.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60} // Added innerRadius for a modern "donut" look
                          outerRadius={100}
                          paddingAngle={2} // Adds small gaps between slices
                          dataKey="value"
                          stroke="none"
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 italic">
                    No expenses recorded yet.
                  </div>
                )}
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Add Transaction</h3>
                   <TransactionForm onAdd={addTransaction} />
                </div>
              </div>
            </div>

            {/* List Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
              <TransactionList data={data} onDelete={deleteTransaction} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;