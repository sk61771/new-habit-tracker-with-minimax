import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentMonth } from '../utils/formatters';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  incomes: [],
  budgets: {},
  currentMonth: getCurrentMonth()
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp =>
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(exp => exp.id !== action.payload)
      };
    case 'SET_INCOMES':
      return { ...state, incomes: action.payload };
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map(inc =>
          inc.id === action.payload.id ? action.payload : inc
        )
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter(inc => inc.id !== action.payload)
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.month]: action.payload.amount }
      };
    case 'SET_MONTH':
      return { ...state, currentMonth: action.payload };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [persistedData, setPersistedData] = useLocalStorage('expense-tracker-data', initialState);
  const [state, dispatch] = useReducer(expenseReducer, persistedData);

  useEffect(() => {
    setPersistedData(state);
  }, [state, setPersistedData]);

  // Expense functions
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString()
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const updateExpense = (expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  // Income functions
  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      date: income.date || new Date().toISOString()
    };
    dispatch({ type: 'ADD_INCOME', payload: newIncome });
  };

  const updateIncome = (income) => {
    dispatch({ type: 'UPDATE_INCOME', payload: income });
  };

  const deleteIncome = (id) => {
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  // Budget functions
  const setBudget = (month, amount) => {
    dispatch({ type: 'SET_BUDGET', payload: { month, amount } });
  };

  const setCurrentMonth = (month) => {
    dispatch({ type: 'SET_MONTH', payload: month });
  };

  // Get monthly data
  const getMonthlyExpenses = (month) => {
    return state.expenses.filter(exp => {
      const expMonth = exp.date.substring(0, 7);
      return expMonth === month;
    });
  };

  const getMonthlyIncomes = (month) => {
    return state.incomes.filter(inc => {
      const incMonth = inc.date.substring(0, 7);
      return incMonth === month;
    });
  };

  const getMonthlyTotal = (month) => {
    return getMonthlyExpenses(month).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getMonthlyIncomeTotal = (month) => {
    return getMonthlyIncomes(month).reduce((sum, inc) => sum + inc.amount, 0);
  };

  const getBalance = (month) => {
    return getMonthlyIncomeTotal(month) - getMonthlyTotal(month);
  };

  const getCategoryTotals = (month) => {
    const monthlyExpenses = getMonthlyExpenses(month);
    const totals = {};
    monthlyExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  };

  const getIncomeCategoryTotals = (month) => {
    const monthlyIncomes = getMonthlyIncomes(month);
    const totals = {};
    monthlyIncomes.forEach(inc => {
      totals[inc.category] = (totals[inc.category] || 0) + inc.amount;
    });
    return totals;
  };

  const getBudget = (month) => {
    return state.budgets[month] || 0;
  };

  const getRemainingBudget = (month) => {
    const budget = getBudget(month);
    const spent = getMonthlyTotal(month);
    return budget - spent;
  };

  const getBudgetPercentage = (month) => {
    const budget = getBudget(month);
    if (budget === 0) return 0;
    const spent = getMonthlyTotal(month);
    return Math.min((spent / budget) * 100, 100);
  };

  const value = {
    expenses: state.expenses,
    incomes: state.incomes,
    budgets: state.budgets,
    currentMonth: state.currentMonth,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    setBudget,
    setCurrentMonth,
    getMonthlyExpenses,
    getMonthlyIncomes,
    getMonthlyTotal,
    getMonthlyIncomeTotal,
    getBalance,
    getCategoryTotals,
    getIncomeCategoryTotals,
    getBudget,
    getRemainingBudget,
    getBudgetPercentage
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
