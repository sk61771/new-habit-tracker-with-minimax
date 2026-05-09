import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Filter } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, getCategoryById } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ExpenseList({ onEditExpense, onDeleteExpense }) {
  const { expenses, currentMonth } = useExpense();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(exp => exp.date.startsWith(currentMonth));
  }, [expenses, currentMonth]);

  const filteredExpenses = useMemo(() => {
    return monthlyExpenses
      .filter(exp => {
        if (filterCategory && exp.category !== filterCategory) return false;
        if (search && !exp.description?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [monthlyExpenses, search, filterCategory]);

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">All Expenses</h1>
        <p className="text-slate-400">Manage your monthly transactions</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="input-field pl-12"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Showing {filteredExpenses.length} expenses</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalFiltered)}</p>
        </div>
        <button
          onClick={() => {
            setSearch('');
            setFilterCategory('');
          }}
          className="btn-secondary text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* List */}
      {filteredExpenses.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {monthlyExpenses.length === 0 ? 'No expenses yet' : 'No matching expenses'}
          </h3>
          <p className="text-slate-400">
            {monthlyExpenses.length === 0
              ? 'Add your first expense to start tracking'
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const category = getCategoryById(expense.category);
            const Icon = category.icon;
            return (
              <div
                key={expense.id}
                className="card flex items-center justify-between p-4 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: category.color + '30' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {expense.description || category.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.name}
                      </span>
                      <span className="text-sm text-slate-500">{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(expense.amount)}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="p-2 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
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
  );
}
