import { useState } from "react";
import { format, getYear } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetComparison } from "@/components/budgets/budget-comparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetPage() {
  const { budgets, deleteBudget, getSummary, getCategoryName, getCategoryColor } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === selectedMonth && budget.year === selectedYear
  );

  const summary = getSummary(selectedMonth, selectedYear);
  const categoryExpenses: Record<string, number> = {};
  
  summary.categoryBreakdown.forEach((item) => {
    categoryExpenses[item.categoryId] = item.amount;
  });

  const handleEdit = (budget: any) => {
    setSelectedBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = (budgetId: string) => {
    deleteBudget(budgetId);
  };

  const handleAddBudget = () => {
    setSelectedBudget(null);
    setIsDialogOpen(true);
  };

  const createMonthOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      const date = new Date(2000, i - 1, 1);
      options.push({
        value: i.toString(),
        label: format(date, "MMMM"),
      });
    }
    return options;
  };

  const createYearOptions = () => {
    const options = [];
    const currentYear = getYear(new Date());
    for (let i = currentYear; i >= currentYear - 5; i--) {
      options.push({
        value: i.toString(),
        label: i.toString(),
      });
    }
    return options;
  };

  const monthOptions = createMonthOptions();
  const yearOptions = createYearOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <Button onClick={handleAddBudget}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Category Budgets</CardTitle>
              <CardDescription>Manage your monthly spending limits</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {currentMonthBudgets.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No budgets set for this month</p>
                <Button variant="outline" className="mt-2" onClick={handleAddBudget}>
                  Add your first budget
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthBudgets.map((budget) => {
                    const spent = categoryExpenses[budget.category] || 0;
                    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                    const isOverBudget = percentage > 100;
                    
                    return (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getCategoryColor(budget.category) }}
                            />
                            {getCategoryName(budget.category)}
                          </div>
                        </TableCell>
                        <TableCell>${budget.amount.toFixed(2)}</TableCell>
                        <TableCell>${spent.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress
                              value={Math.min(percentage, 100)}
                              className={isOverBudget ? "bg-red-200" : ""}
                              indicatorClassName={isOverBudget ? "bg-red-500" : ""}
                            />
                            <p className="text-xs text-muted-foreground">
                              {percentage.toFixed(0)}% {isOverBudget && "(Over budget)"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(budget)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDelete(budget.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <BudgetComparison />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBudget ? "Edit Budget" : "Add New Budget"}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={selectedBudget}
            onComplete={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}