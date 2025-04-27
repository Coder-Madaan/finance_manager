import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  CATEGORIES, 
  Transaction, 
  Budget,
  Summary
} from "@/types";
import {  startOfMonth, endOfMonth } from "date-fns";

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getBudget: (categoryId: string, month: number, year: number) => Budget | undefined;
  getSummary: (month: number, year: number) => Summary;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getBudgetVsActual: (month: number, year: number) => Array<{
    category: string;
    budget: number;
    actual: number;
    color: string;
  }>;
  getCategoryName: (id: string) => string;
  getCategoryColor: (id: string) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedBudgets = localStorage.getItem("budgets");

    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions, (key, value) => {
          if (key === "date" || key === "createdAt" || key === "updatedAt") {
            return new Date(value);
          }
          return value;
        });
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error("Failed to parse transactions:", error);
      }
    }

    if (savedBudgets) {
      try {
        const parsedBudgets = JSON.parse(savedBudgets);
        setBudgets(parsedBudgets);
      } catch (error) {
        console.error("Failed to parse budgets:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updatedTransaction.id
          ? { ...updatedTransaction, updatedAt: new Date() }
          : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getTransaction = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, "id">) => {
    // Check if budget already exists for this category in this month/year
    const existing = getBudget(budget.category, budget.month, budget.year);
    if (existing) {
      // Update instead of adding
      updateBudget({ ...existing, amount: budget.amount });
      return;
    }

    const newBudget: Budget = {
      ...budget,
      id: uuidv4(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const getBudget = (categoryId: string, month: number, year: number) => {
    return budgets.find(
      (b) => b.category === categoryId && b.month === month && b.year === year
    );
  };

  // Helper for getting transactions in a specific month
  const getTransactionsByMonth = (month: number, year: number) => {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    return transactions.filter(
      (t) => t.date >= start && t.date <= end
    );
  };

  // Calculate summary statistics
  const getSummary = (month: number, year: number): Summary => {
    const monthTransactions = getTransactionsByMonth(month, year);
    
    const totalIncome = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    // Calculate category breakdown for expenses
    const categoryTotals = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    const categoryBreakdown = Object.entries(categoryTotals).map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: totalExpenses ? (amount / totalExpenses) * 100 : 0,
    }));
    
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      categoryBreakdown,
    };
  };

  // Get budget vs actual spending
  const getBudgetVsActual = (month: number, year: number) => {
    const monthTransactions = getTransactionsByMonth(month, year);
    
    // Get actual spending by category
    const actualByCategory = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    // Get all categories that have either a budget or spending
    const allCategories = new Set([
      ...Object.keys(actualByCategory),
      ...budgets
        .filter(b => b.month === month && b.year === year)
        .map(b => b.category)
    ]);
    
    return Array.from(allCategories).map(categoryId => {
      const budget = getBudget(categoryId, month, year);
      const actual = actualByCategory[categoryId] || 0;
      const category = CATEGORIES.find(c => c.id === categoryId);
      
      return {
        category: category?.name || categoryId,
        budget: budget?.amount || 0,
        actual,
        color: category?.color || "#666666"
      };
    });
  };

  // Helper functions to get category information
  const getCategoryName = (id: string) => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.name : "Unknown";
  };
  
  const getCategoryColor = (id: string) => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.color : "#666666";
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudget,
        getSummary,
        getTransactionsByMonth,
        getBudgetVsActual,
        getCategoryName,
        getCategoryColor,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};