import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency, getMonthName, getCurrentMonth } from '../utils/formatters';

export default function BudgetManager() {
  const {
    currentMonth,
    setCurrentMonth,
    setBudget,
    getBudget,
    getMonthlyTotal,
    getBudgetPercentage,
    getRemainingBudget,
    getCategoryTotals
  } = useExpense();

  const [editBudget, setEditBudget] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const budget = getBudget(currentMonth);
  const totalSpent = getMonthlyTotal(currentMonth);
  const remaining = getRemainingBudget(currentMonth);
  const percentage = getBudgetPercentage(currentMonth);
  const categoryTotals = getCategoryTotals(currentMonth);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(year, parseInt(month) - 2);
    setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(year, parseInt(month));
    setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleSaveBudget = () => {
    if (budgetAmount) {
      setBudget(currentMonth, parseFloat(budgetAmount));
      setEditBudget(false);
      setBudgetAmount('');
    }
  };

  const handleCancelBudget = () => {
    setEditBudget(false);
    setBudgetAmount('');
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'from-red-500 to-red-600';
    if (percentage >= 80) return 'from-orange-500 to-orange-600';
    return 'from-emerald-500 to-teal-500';
  };

  const isCurrentMonth = currentMonth === getCurrentMonth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Manager</h1>
          <p className="text-slate-400">Track and set monthly budgets</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <span className="px-4 py-2 bg-slate-700/50 rounded-xl font-medium text-white min-w-[160px] text-center">
            {getMonthName(currentMonth)}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
            disabled={isCurrentMonth}
          >
            <ChevronRight className={`w-5 h-5 ${isCurrentMonth ? 'text-slate-600' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Budget Setup Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Monthly Budget</h2>
          {!editBudget && (
            <button
              onClick={() => {
                setEditBudget(true);
                setBudgetAmount(budget ? budget.toString() : '');
              }}
              className="btn-secondary text-sm"
            >
              {budget ? 'Edit Budget' : 'Set Budget'}
            </button>
          )}
        </div>

        {editBudget ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget Amount (EUR)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    €
                  </span>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="1000.00"
                    className="input-field pl-10 text-lg font-semibold"
                    autoFocus
                  />
                </div>
                <button onClick={handleSaveBudget} className="btn-primary px-6">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={handleCancelBudget} className="btn-secondary px-4">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {budget > 0 ? (
              <div>
                <p className="text-slate-400 mb-2">Current budget</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {formatCurrency(budget)}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💰</div>
                <p className="text-slate-400 mb-2">No budget set</p>
                <p className="text-sm text-slate-500">Click "Set Budget" to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Budget Progress */}
      {budget > 0 && (
        <div className="card">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Spent</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Progress</span>
              <span className={`text-sm font-bold ${
                percentage >= 100 ? 'text-red-400' : percentage >= 80 ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {percentage >= 80 && (
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              percentage >= 100
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-orange-500/20 border border-orange-500/50'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${percentage >= 100 ? 'text-red-400' : 'text-orange-400'}`} />
              <div>
                <p className={`font-semibold ${percentage >= 100 ? 'text-red-400' : 'text-orange-400'}`}>
                  {percentage >= 100 ? 'Budget Exceeded!' : 'Budget Warning'}
                </p>
                <p className="text-sm text-slate-300">
                  {percentage >= 100
                    ? `You've spent ${formatCurrency(Math.abs(remaining))} over your budget`
                    : `You've used ${percentage.toFixed(0)}% of your monthly budget`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      {budget > 0 && Object.keys(categoryTotals).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([categoryId, amount]) => {
                const percentage_of_budget = (amount / budget) * 100;
                const category = CATEGORIES?.find?.(c => c.id === categoryId) || { name: categoryId, color: '#64748b', icon: 'div' };

                return (
                  <div key={categoryId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{category.name}</span>
                      <span className="text-white font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage_of_budget, 100)}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
