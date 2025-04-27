import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { CATEGORIES } from "@/types";
import { format, getDaysInMonth, getYear, subMonths } from "date-fns";
import { useTheme } from "@/components/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MonthlyChart() {
  const { theme } = useTheme();
  const { getTransactionsByMonth } = useFinance();
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

  const transactions = getTransactionsByMonth(selectedMonth, selectedYear);
  const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth - 1));

  const dailyExpenses = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayTransactions = transactions.filter(t => {
      const transactionDay = new Date(t.date).getDate();
      return transactionDay === day && t.type === "expense";
    });

    const categoryTotals: Record<string, number> = {};
    
    dayTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const result: any = {
      day: day,
      total: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
    };

    CATEGORIES.forEach(category => {
      if (categoryTotals[category.id]) {
        result[category.id] = categoryTotals[category.id];
      }
    });

    return result;
  });

  const usedCategories = CATEGORIES.filter(category => {
    return transactions.some(t => t.category === category.id && t.type === "expense");
  });

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="font-bold">{`Day ${label}`}</p>
          {payload.map((entry, index) => {
            if (entry.value === 0) return null;
            
            const category = entry.dataKey !== 'total' 
              ? CATEGORIES.find(c => c.id === entry.dataKey) 
              : { name: 'Total', color: '#666' };
              
            return (
              <p key={`item-${index}`} style={{ color: category?.color }}>
                {category?.name}: ${entry.value?.toFixed(2)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Daily spending breakdown by category</CardDescription>
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
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyExpenses}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {usedCategories.map((category) => (
                <Bar
                  key={category.id}
                  dataKey={category.id}
                  name={category.name}
                  stackId="a"
                  fill={category.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}