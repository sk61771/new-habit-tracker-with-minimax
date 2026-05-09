import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

export default function ExpenseForm({ onSave, onClose, editExpense }) {
  const [amount, setAmount] = useState(editExpense ? editExpense.amount.toString() : '');
  const [category, setCategory] = useState(editExpense ? editExpense.category : '');
  const [description, setDescription] = useState(editExpense ? editExpense.description : '');
  const [date, setDate] = useState(
    editExpense ? editExpense.date.split('T')[0] : new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSave({
      id: editExpense?.id,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString()
    });

    if (!editExpense) {
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">
            {editExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                €
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-field pl-10 text-lg font-semibold"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      category === cat.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat.color + '30' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium">{cat.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you spend on?"
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editExpense ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
