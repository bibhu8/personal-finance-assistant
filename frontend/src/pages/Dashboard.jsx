import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { transactionAPI } from '../api/axios';
import StatCard from '../components/dashboard/StatCard';
import ExpensesPieChart from '../components/dashboard/ExpensesPieChart';
import SpendingTrendsChart from '../components/dashboard/SpendingTrendsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import QuickActions from '../components/dashboard/QuickActions';
import { subDays, format } from 'date-fns';
import { formatCurrency } from '../utils/formatters'; 


function buildCategoryPie(transactions = []) {
  const sums = new Map();
  for (const t of transactions) {
    if (!t) continue;
    const isExpense = String(t.type).toLowerCase() === 'expense';
    if (!isExpense) continue;
    const cat = t.category || 'Others';
    const amount = Math.abs(Number(t.amount) || 0);
    sums.set(cat, (sums.get(cat) || 0) + amount);
  }
  return Array.from(sums.entries()).map(([name, value]) => ({ name, value }));
}
function buildMonthlySeries(transactions = []) {
  const now = new Date();
  const keys = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    keys.push({ key, label: d.toLocaleString(undefined, { month: 'short' }) });
  }

  const sums = new Map(keys.map(({ key }) => [key, 0]));
  for (const t of transactions) {
    const dt = new Date(t?.date || t?.createdAt || Date.now());
    const mkey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    if (!sums.has(mkey)) continue;
    const amt = Number(t.amount) || 0;
    const signed = String(t.type).toLowerCase() === 'expense' ? -Math.abs(amt) : Math.abs(amt);
    sums.set(mkey, (sums.get(mkey) || 0) + signed);
  }

  return keys.map(({ key, label }) => ({ name: label, value: sums.get(key) || 0 }));
}
// --- End of helper functions ---


const Dashboard = () => {
  const [stats, setStats] = useState({ income: 0, expenses: 0, savings: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });

  const reload = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 5,
        startDate: dateRange.from,
        endDate: dateRange.to,
      };

      const res = await transactionAPI.getAll(params);
      const { data, total, totalPages: pagesFromServer } = res.data;
      
      setTransactions(data || []);
      setPage(currentPage);
      setTotalPages(pagesFromServer || 1);
      
      const allTimeRes = await transactionAPI.getAll({ limit: 1000 });
      const allTxData = allTimeRes?.data?.data || [];
      const income = allTxData.filter(t => String(t.type).toLowerCase() === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const expenses = allTxData.filter(t => String(t.type).toLowerCase() === 'expense')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      setStats({
        income,
        expenses,
        savings: income - expenses,
        balance: income - expenses,
      });

    } catch (err) {
      console.error('Dashboard reload error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    reload(1);
  }, [reload]);

  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      reload(newPage);
    }
  };
  
  useEffect(() => {
    const onDataChanged = () => reload(1);
    window.addEventListener('dataChanged', onDataChanged);
    return () => window.removeEventListener('dataChanged', onDataChanged);
  }, [reload]);

  const pieData = useMemo(() => buildCategoryPie(transactions), [transactions]);
  const lineData = useMemo(() => buildMonthlySeries(transactions), [transactions]);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={() => reload(page)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          title="Fetch latest data from server"
        >
          Sync Data
        </button>
      </div>

      {/* --- UPDATED: Use the formatCurrency function --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Income"   value={formatCurrency(stats.income)}   subtitle="All Time" />
        <StatCard title="Total Expenses" value={formatCurrency(stats.expenses)} subtitle="All Time" />
        <StatCard title="Net Savings"    value={formatCurrency(stats.savings)}  subtitle="All Time" />
        <StatCard title="Balance"        value={formatCurrency(stats.balance)}  subtitle="Available" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExpensesPieChart data={pieData} />
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4">
            <h4 className="text-md font-semibold text-white">Filter Transactions:</h4>
            <div className="flex items-center gap-2">
              <label htmlFor="from" className="text-sm text-slate-400">From:</label>
              <input type="date" name="from" value={dateRange.from} onChange={handleDateChange} className="bg-slate-700 text-white p-2 rounded-md border border-slate-600" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="to" className="text-sm text-slate-400">To:</label>
              <input type="date" name="to" value={dateRange.to} onChange={handleDateChange} className="bg-slate-700 text-white p-2 rounded-md border border-slate-600" />
            </div>
          </div>
          <RecentTransactions
            transactions={transactions}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
        <div className="space-y-6">
          <SpendingTrendsChart data={lineData} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;