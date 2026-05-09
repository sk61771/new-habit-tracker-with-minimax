import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Filter, TrendingUp } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { INCOME_CATEGORIES, getIncomeCategoryById } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function IncomeList({ onEditIncome, onDeleteIncome }) {
  const { incomes, currentMonth } = useExpense();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const monthlyIncomes = useMemo(() => {
    return incomes.filter(inc => inc.date.startsWith(currentMonth));
  }, [incomes, currentMonth]);

  const filteredIncomes = useMemo(() => {
    return monthlyIncomes
      .filter(inc => {
        if (filterCategory && inc.category !== filterCategory) return false;
        if (search && !inc.description?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [monthlyIncomes, search, filterCategory]);

  const totalFiltered = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Income Sources</h1>
        <p className="text-slate-400">Track all your income for this month</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search income..."
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
            <option value="">All Sources</option>
            {INCOME_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Showing {filteredIncomes.length} entries</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalFiltered)}</p>
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
      {filteredIncomes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💵</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {monthlyIncomes.length === 0 ? 'No income recorded' : 'No matching entries'}
          </h3>
          <p className="text-slate-400">
            {monthlyIncomes.length === 0
              ? 'Add your income to start tracking your earnings'
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncomes.map((income) => {
            const category = getIncomeCategoryById(income.category);
            const Icon = category.icon;
            return (
              <div
                key={income.id}
                className="card flex items-center justify-between p-4 hover:border-emerald-500/50 transition-all group"
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
                      {income.description || category.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.name}
                      </span>
                      <span className="text-sm text-slate-500">{formatDate(income.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-emerald-400">
                    +{formatCurrency(income.amount)}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditIncome(income)}
                      className="p-2 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onDeleteIncome(income.id)}
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
