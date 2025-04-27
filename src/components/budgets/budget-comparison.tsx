import { useState } from "react";
import { format, getYear } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetComparison() {
  const { getBudgetVsActual } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

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

  const budgetData = getBudgetVsActual(selectedMonth, selectedYear);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Budget vs. Actual</CardTitle>
          <CardDescription>Compare your budgets with actual spending</CardDescription>
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
        <div className="h-[300px]">
          {budgetData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No budget data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={budgetData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#8884d8" />
                <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}