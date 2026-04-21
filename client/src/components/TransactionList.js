import { useMemo } from "react";

// Utility for professional currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Utility for cleaner date reading (e.g., "Oct 12, 2023")
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

function TransactionList({ data, onDelete }) {
  // Automatically sort transactions from newest to oldest
  const sortedTransactions = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]);

  if (sortedTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-slate-700 font-medium mb-1">No transactions yet</h4>
        <p className="text-slate-500 text-sm">When you add income or expenses, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map((t) => {
        const isIncome = t.type === "income";

        return (
          <div
            key={t._id}
            className="group flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left Side: Icon & Details */}
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {isIncome ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 capitalize tracking-wide">{t.category}</span>
                {t.date && (
                  <span className="text-xs font-medium text-slate-400 mt-0.5">
                    {formatDate(t.date)}
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Amount & Delete */}
            <div className="flex items-center gap-5">
              <span className={`font-bold tracking-tight ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
              </span>
              
              <button
                onClick={() => onDelete(t._id)}
                className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Delete transaction"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;