import { z } from "zod";

// Predefined categories
export const CATEGORIES = [
  { id: "housing", name: "Housing", color: "#8B5CF6" },
  { id: "food", name: "Food & Dining", color: "#EC4899" },
  { id: "transportation", name: "Transportation", color: "#10B981" },
  { id: "utilities", name: "Utilities", color: "#F59E0B" },
  { id: "entertainment", name: "Entertainment", color: "#3B82F6" },
  { id: "healthcare", name: "Healthcare", color: "#EF4444" },
  { id: "shopping", name: "Shopping", color: "#6366F1" },
  { id: "personal", name: "Personal", color: "#8B5CF6" },
  { id: "education", name: "Education", color: "#F97316" },
  { id: "savings", name: "Savings", color: "#14B8A6" },
  { id: "debt", name: "Debt", color: "#F43F5E" },
  { id: "income", name: "Income", color: "#22C55E" },
  { id: "other", name: "Other", color: "#64748B" },
];

// Schema for transactions
export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  date: z.date(),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["expense", "income"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Schema for budgets
export const budgetSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

export type Budget = z.infer<typeof budgetSchema>;

// Summary statistics type
export type Summary = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
};