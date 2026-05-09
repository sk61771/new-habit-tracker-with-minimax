import React, { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetManager from './components/BudgetManager';

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { addExpense, updateExpense, deleteExpense } = useExpense();

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

  const handleCloseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleFABClick = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'add':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">💸</div>
              <h2 className="text-xl font-semibold text-white mb-2">Add New Expense</h2>
              <p className="text-slate-400 mb-6">Click the + button below to add your first expense</p>
              <button onClick={handleFABClick} className="btn-primary">
                Add Expense
              </button>
            </div>
          </div>
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

      {/* FAB Button */}
      <button
        onClick={handleFABClick}
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          onSave={handleSaveExpense}
          onClose={handleCloseForm}
          editExpense={editingExpense}
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
