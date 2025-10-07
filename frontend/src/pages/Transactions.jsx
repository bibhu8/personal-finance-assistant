import React, { useState, useEffect, useMemo } from 'react';
import { transactionAPI } from '../api/axios';
import { formatDate, formatTransactionAmount } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import { Plus, Trash2 } from 'lucide-react';

const PAGE_SIZE = 10;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [serverPage, setServerPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  async function loadServer(page = 1) {
    setLoading(true);
    try {
      const res = await (transactionAPI.getAll({ page, limit: PAGE_SIZE }) || transactionAPI.getAll());
      const body = res?.data || {};
      const data = body.data || body || [];
      setTransactions(data);
      if (Number.isFinite(body.totalPages)) {
        setServerTotalPages(body.totalPages);
        setServerPage(body.page || page);
      } else {
        setServerTotalPages(null);
        setServerPage(1);
      }
    } catch (err) {
      console.error('load transactions:', err);
      alert(err.response?.data?.message || 'Error loading transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServer(1);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await transactionAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setShowForm(false);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      window.dispatchEvent(new Event('dataChanged'));
      loadServer(serverPage);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await transactionAPI.delete(id);
      window.dispatchEvent(new Event('dataChanged'));
      loadServer(serverPage);
    } catch (error) {
      alert('Error deleting transaction');
    }
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const [clientPage, setClientPage] = useState(1);
  const clientTotalPages = useMemo(() => {
    if (serverTotalPages !== null) return serverTotalPages;
    return Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  }, [transactions.length, serverTotalPages]);

  const visibleRows = useMemo(() => {
    if (serverTotalPages !== null) return transactions;
    const start = (clientPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, clientPage, serverTotalPages]);

  const activePage = serverTotalPages !== null ? serverPage : clientPage;
  const setActivePage = (p) => {
    if (serverTotalPages !== null) {
      setServerPage(p);
      loadServer(p);
    } else {
      setClientPage(p);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                  className="input px-3 py-2" // UPDATED
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input px-3 py-2" // UPDATED
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input px-3 py-2" // UPDATED
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input px-3 py-2" // UPDATED
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input px-3 py-2" // UPDATED
                placeholder="Enter description"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">All Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-700/50">
                  <td className="py-3 text-sm text-slate-300">{formatDate(tx.date || tx.createdAt)}</td>
                  <td className="py-3 text-sm text-slate-200">{tx.description}</td>
                  <td className="py-3 text-sm text-slate-400">{tx.category}</td>
                  <td className={`py-3 text-sm text-right font-medium ${
                    String(tx.type).toLowerCase() === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatTransactionAmount(tx.amount, tx.type)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400">No transactions</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-400">
            Page {activePage} of {clientTotalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
              onClick={() => setActivePage(Math.max(1, activePage - 1))}
              disabled={activePage <= 1}
            >Prev</button>
            <button
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
              onClick={() => setActivePage(Math.min(clientTotalPages, activePage + 1))}
              disabled={activePage >= clientTotalPages}
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;