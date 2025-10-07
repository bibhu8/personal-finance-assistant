import React from 'react';
import { formatDate, formatTransactionAmount } from '../../utils/formatters';

export default function RecentTransactions({
  transactions = [],
  page,
  totalPages,
  onPageChange,
  loading, // <-- NEW: Loading prop
}) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto min-h-[200px]"> {/* Added min-height */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
              <th className="pb-3">Date</th>
              <th className="pb-3">Description</th>
              <th className="pb-3">Category</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-400">
                  No transactions found for the selected period.
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr key={tx._id || index} className="border-b border-slate-700/50">
                  <td className="py-3 text-sm text-slate-300">
                    {formatDate(tx.date || tx.createdAt)}
                  </td>
                  <td className="py-3 text-sm text-slate-200">{tx.description}</td>
                  <td className="py-3 text-sm text-slate-400">{tx.category}</td>
                  <td className={`py-3 text-sm text-right font-medium ${
                    String(tx.type).toLowerCase() === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatTransactionAmount(tx.amount, tx.type)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-400">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600 transition-colors"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
            >Prev</button>
            <button
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600 transition-colors"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
}