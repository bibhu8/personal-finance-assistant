import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PiggyBank, CreditCard, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FinTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Take Control of Your Financial Future
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Smart budgeting, effortless tracking and insightful analytics—all in one place.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start for Free
            </Link>
          </div>
          
          <div className="relative">
            <div className="card p-8 backdrop-blur-sm bg-slate-800/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Total Income</span>
                  {/* UPDATED SYMBOL */}
                  <span className="text-2xl font-bold text-green-400">₹3,099</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Total Expenses</span>
                  {/* UPDATED SYMBOL */}
                  <span className="text-2xl font-bold text-red-400">₹1,589</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Net Savings</span>
                  {/* UPDATED SYMBOL */}
                  <span className="text-2xl font-bold text-primary-400">₹1,510</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Budgeting</h3>
            <p className="text-slate-400">Set budgets and track spending across categories effortlessly</p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Expense Tracking</h3>
            <p className="text-slate-400">Upload receipts and automatically extract transaction details</p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Financial Insights</h3>
            <p className="text-slate-400">Visualize spending patterns with interactive charts and reports</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;