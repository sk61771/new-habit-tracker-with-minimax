import React, { useState } from 'react';
import { Menu, Plus, Minus, ArrowUpCircle } from 'lucide-react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import BudgetManager from './components/BudgetManager';

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const { addExpense, updateExpense, deleteExpense, addIncome, updateIncome, deleteIncome } = useExpense();

  // Expense handlers
  const handleSaveExpense = (expense) => {
    if (expense.id) {
      updateExpense(expense);
    } else {
      addExpense(expense);
    }
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  // Income handlers
  const handleSaveIncome = (income) => {
    if (income.id) {
      updateIncome(income);
    } else {
      addIncome(income);
    }
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleDeleteIncome = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteIncome(id);
    }
  };

  const handleCloseIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  // FAB menu state
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  const handleFABClick = () => {
    setFabMenuOpen(!fabMenuOpen);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
    setFabMenuOpen(false);
  };

  const handleAddIncome = () => {
    setEditingIncome(null);
    setShowIncomeForm(true);
    setFabMenuOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onEditIncome={handleEditIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        );
      case 'add':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-xl font-semibold text-white mb-2">Quick Add</h2>
              <p className="text-slate-400 mb-6">Choose what to add</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAddExpense}
                  className="btn-primary bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30"
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Expense
                </button>
                <button
                  onClick={handleAddIncome}
                  className="btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Income
                </button>
              </div>
            </div>
          </div>
        );
      case 'income':
        return (
          <IncomeList
            onEditIncome={handleEditIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        );
      case 'expenses':
        return (
          <ExpenseList
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'budget':
        return <BudgetManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <span className="font-bold text-white">ExpenseTrack</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 pb-24 lg:pb-8 px-4 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* FAB Menu */}
      <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-20">
        {/* FAB Menu Items */}
        {fabMenuOpen && (
          <div className="absolute bottom-16 right-0 mb-2 space-y-2 animate-fade-in">
            <button
              onClick={handleAddIncome}
              className="flex items-center gap-3 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition-all"
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span className="font-medium">Income</span>
            </button>
            <button
              onClick={handleAddExpense}
              className="flex items-center gap-3 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Expense</span>
            </button>
          </div>
        )}

        {/* FAB Button */}
        <button
          onClick={handleFABClick}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${
            fabMenuOpen
              ? 'bg-slate-600 rotate-45'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-500/30'
          }`}
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          onSave={handleSaveExpense}
          onClose={handleCloseExpenseForm}
          editExpense={editingExpense}
        />
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <IncomeForm
          onSave={handleSaveIncome}
          onClose={handleCloseIncomeForm}
          editIncome={editingIncome}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
