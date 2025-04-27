import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, getYear } from "date-fns";

export function CategoryChart() {
  const { getSummary, getCategoryName } = useFinance();
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

  const summary = getSummary(selectedMonth, selectedYear);

  const getCategoryColor = (categoryId: string) => {
    // Define a set of colors for different categories
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
      "#D4A5A5", "#9B59B6", "#3498DB", "#E67E22", "#2ECC71"
    ];
    
    // Use the categoryId to consistently pick a color
    const index = parseInt(categoryId, 36) % colors.length;
    return colors[index];
  };
  
  const chartData = summary.categoryBreakdown.map((item) => ({
    name: getCategoryName(item.categoryId),
    value: item.amount,
    color: getCategoryColor(item.categoryId),
    percentage: item.percentage.toFixed(1),
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Spending breakdown by category</CardDescription>
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
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No expense data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}