import { useFinance } from "@/context/FinanceContext";
import { format, getMonth, getYear, subMonths } from "date-fns";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ArrowDownCircle, ArrowUpCircle, BarChart3, DollarSign } from "lucide-react";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetComparison } from "@/components/budgets/budget-comparison";

export function Dashboard() {
  const { getSummary } = useFinance();
  
  const currentMonth = getMonth(new Date()) + 1;
  const currentYear = getYear(new Date());
  const lastMonth = getMonth(subMonths(new Date(), 1)) + 1;
  const lastMonthYear = getYear(subMonths(new Date(), 1));
  
  const currentSummary = getSummary(currentMonth, currentYear);
  const lastMonthSummary = getSummary(lastMonth, lastMonthYear);
  
  const incomeTrend = lastMonthSummary.totalIncome > 0
    ? ((currentSummary.totalIncome - lastMonthSummary.totalIncome) / lastMonthSummary.totalIncome) * 100
    : 0;
  
  const expenseTrend = lastMonthSummary.totalExpenses > 0
    ? ((currentSummary.totalExpenses - lastMonthSummary.totalExpenses) / lastMonthSummary.totalExpenses) * 100
    : 0;
  
  const balanceTrend = lastMonthSummary.netBalance !== 0
    ? ((currentSummary.netBalance - lastMonthSummary.netBalance) / Math.abs(lastMonthSummary.netBalance)) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <span className="text-muted-foreground">
          {format(new Date(), "MMMM yyyy")}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={`$${currentSummary.totalIncome.toFixed(2)}`}
          description="Total income this month"
          icon={<ArrowUpCircle className="h-4 w-4 text-green-500" />}
          trend={{
            value: incomeTrend,
            isPositive: incomeTrend >= 0,
          }}
          className="bg-green-950 border-green-900 text-green-50"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${currentSummary.totalExpenses.toFixed(2)}`}
          description="Total expenses this month"
          icon={<ArrowDownCircle className="h-4 w-4 text-red-500" />}
          trend={{
            value: -expenseTrend,
            isPositive: expenseTrend <= 0,
          }}
          className="bg-red-950 border-red-900 text-red-50"
        />
        <SummaryCard
          title="Net Balance"
          value={`$${currentSummary.netBalance.toFixed(2)}`}
          description="Income minus expenses"
          icon={<DollarSign className="h-4 w-4 text-blue-500" />}
          trend={{
            value: balanceTrend,
            isPositive: balanceTrend >= 0,
          }}
          className="bg-blue-950 border-blue-900 text-blue-50"
        />
        <SummaryCard
          title="Spending Insights"
          value={currentSummary.categoryBreakdown.length > 0
            ? `${currentSummary.categoryBreakdown[0].categoryId}`
            : "No data"}
          description={currentSummary.categoryBreakdown.length > 0
            ? `Highest spending category`
            : "Add transactions to see insights"}
          icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
          className="bg-purple-950 border-purple-900 text-purple-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlyChart />
        <div className="grid gap-4 lg:col-span-3">
          <CategoryChart />
          <BudgetComparison />
        </div>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}