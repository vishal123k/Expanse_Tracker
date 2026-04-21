function TransactionList({ data, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-4">No transactions yet. Add some!</p>
      )}

      <div className="space-y-3">
        {data.map((t) => (
          <div
            key={t._id}
            className={`flex justify-between items-center p-3 rounded border transition ${
              t.type === "income"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{t.category}</span>
              {/* Show date if it exists */}
              {t.date && (
                <span className="text-xs text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </span>
              <button 
                onClick={() => onDelete(t._id)}
                className="text-red-400 hover:text-red-600 px-2 py-1 bg-white rounded shadow-sm border border-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;