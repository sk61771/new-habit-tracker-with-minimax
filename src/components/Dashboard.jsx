import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import DonutChart from './DonutChart';
import CategoryChart from './CategoryChart';
import { formatDate } from '../utils/formatters';
import { getCategoryById } from '../utils/categories';
import { Edit2, Trash2 } from 'lucide-react';

export default function Dashboard({ onEditExpense, onDeleteExpense }) {
  const {
    currentMonth,
    getMonthlyTotal,
    getBudget,
    getBudgetPercentage,
    getRemainingBudget,
    getMonthlyExpenses,
    getCategoryTotals
  } = useExpense();

  const totalSpent = getMonthlyTotal(currentMonth);
  const budget = getBudget(currentMonth);
  const remaining = getRemainingBudget(currentMonth);
  const percentage = getBudgetPercentage(currentMonth);
  const expenses = getMonthlyExpenses(currentMonth);
  const categoryTotals = getCategoryTotals(currentMonth);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const dailyAverage = expenses.length > 0
    ? totalSpent / new Date().getDate()
    : 0;

  const getProgressColor = () => {
    if (percentage >= 100) return 'from-red-500 to-red-600';
    if (percentage >= 80) return 'from-orange-500 to-orange-600';
    return 'from-emerald-500 to-teal-500';
  };

  const getProgressWarning = () => {
    if (percentage >= 100) return 'bg-red-500/20 border-red-500/50';
    if (percentage >= 80) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-emerald-500/20 border-emerald-500/50';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{getMonthName(currentMonth)}</h1>
          <p className="text-slate-400">Your expense overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Budget</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(budget)}</p>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProgressColor()} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${remaining < 0 ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Daily Avg</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(dailyAverage)}</p>
        </div>
      </div>

      {/* Budget Progress */}
      {budget > 0 && (
        <div className={`card ${getProgressWarning()} border`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">Budget Progress</span>
            <span className={`text-sm font-bold ${percentage >= 100 ? 'text-red-400' : percentage >= 80 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {percentage >= 80 && (
            <p className="text-sm text-amber-400 mt-2 flex items-center gap-1">
              {percentage >= 100 ? '⚠️ Budget exceeded!' : '⚠️ Approaching budget limit'}
            </p>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Spending Overview</h3>
          <DonutChart data={categoryTotals} total={totalSpent} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">By Category</h3>
          <CategoryChart data={categoryTotals} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No expenses this month</p>
            <p className="text-sm text-slate-500 mt-1">Add your first expense to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => {
              const category = getCategoryById(expense.category);
              const Icon = category.icon;
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: category.color + '30' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{expense.description || category.name}</p>
                      <p className="text-sm text-slate-400">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{formatCurrency(expense.amount)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
