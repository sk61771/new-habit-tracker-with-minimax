import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import DonutChart from './DonutChart';
import CategoryChart from './CategoryChart';
import IncomeDonutChart from './IncomeDonutChart';
import { formatDate } from '../utils/formatters';
import { getCategoryById, getIncomeCategoryById } from '../utils/categories';
import { Edit2, Trash2 } from 'lucide-react';

export default function Dashboard({ onEditExpense, onDeleteExpense, onEditIncome, onDeleteIncome }) {
  const {
    currentMonth,
    getMonthlyTotal,
    getMonthlyIncomeTotal,
    getBalance,
    getBudget,
    getBudgetPercentage,
    getRemainingBudget,
    getMonthlyExpenses,
    getMonthlyIncomes,
    getCategoryTotals,
    getIncomeCategoryTotals
  } = useExpense();

  const totalSpent = getMonthlyTotal(currentMonth);
  const totalIncome = getMonthlyIncomeTotal(currentMonth);
  const balance = getBalance(currentMonth);
  const budget = getBudget(currentMonth);
  const remaining = getRemainingBudget(currentMonth);
  const percentage = getBudgetPercentage(currentMonth);
  const expenses = getMonthlyExpenses(currentMonth);
  const incomes = getMonthlyIncomes(currentMonth);
  const categoryTotals = getCategoryTotals(currentMonth);
  const incomeCategoryTotals = getIncomeCategoryTotals(currentMonth);

  const recentTransactions = [...expenses, ...incomes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

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
          <p className="text-slate-400">Your financial overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Income</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Expenses</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${balance >= 0 ? 'from-indigo-500 to-purple-500' : 'from-red-500 to-red-600'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Balance</p>
          <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
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
          <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
          {Object.keys(categoryTotals).length > 0 ? (
            <DonutChart data={categoryTotals} total={totalSpent} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <p className="text-slate-400">No expenses recorded</p>
              </div>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Income by Source</h3>
          {Object.keys(incomeCategoryTotals).length > 0 ? (
            <IncomeDonutChart data={incomeCategoryTotals} total={totalIncome} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <span className="text-4xl">💰</span>
                </div>
                <p className="text-slate-400">No income recorded</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No transactions this month</p>
            <p className="text-sm text-slate-500 mt-1">Add your first income or expense to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const isIncome = 'income' === transaction.type || incomes.some(i => i.id === transaction.id);
              const isExpense = expenses.some(e => e.id === transaction.id);
              const isIncomeTx = isIncome && !isExpense;

              const category = isIncomeTx
                ? getIncomeCategoryById(transaction.category)
                : getCategoryById(transaction.category);
              const Icon = category.icon;

              return (
                <div
                  key={transaction.id}
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
                      <p className="font-medium text-white">{transaction.description || category.name}</p>
                      <p className="text-sm text-slate-400">
                        {formatDate(transaction.date)}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isIncomeTx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {isIncomeTx ? 'Income' : 'Expense'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${isIncomeTx ? 'text-emerald-400' : 'text-white'}`}>
                      {isIncomeTx ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => isIncomeTx ? onEditIncome(transaction) : onEditExpense(transaction)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => isIncomeTx ? onDeleteIncome(transaction.id) : onDeleteExpense(transaction.id)}
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
