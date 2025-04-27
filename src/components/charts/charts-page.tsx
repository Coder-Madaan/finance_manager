import { CategoryChart } from "@/components/charts/category-chart";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { BudgetComparison } from "@/components/budgets/budget-comparison";

export function ChartsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Charts & Analysis</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart />
        <MonthlyChart />
        <BudgetComparison />
      </div>
    </div>
  );
}