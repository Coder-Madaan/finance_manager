import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Budget } from "@/types";
import { useFinance } from "@/context/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { format, getYear } from "date-fns";

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
});

interface BudgetFormProps {
  budget?: Budget;
  onComplete: () => void;
}

export function BudgetForm({ budget, onComplete }: BudgetFormProps) {
  const { addBudget, updateBudget } = useFinance();
  const { toast } = useToast();
  const isEditing = !!budget;
  const currentYear = getYear(new Date());
  const currentMonth = new Date().getMonth() + 1;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: budget ? {
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    } : {
      amount: 0,
      month: currentMonth,
      year: currentYear,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const budgetData = {
      ...values,
      category: "total", // Use a fixed category for monthly total budget
    };

    if (isEditing && budget) {
      updateBudget({
        ...budget,
        ...budgetData,
      });
      toast({
        title: "Budget updated",
        description: "Your monthly budget has been updated successfully.",
      });
    } else {
      addBudget(budgetData);
      toast({
        title: "Budget added",
        description: "Your monthly budget has been added successfully.",
      });
    }
    onComplete();
  }

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
    for (let i = currentYear; i <= currentYear + 5; i++) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    className="pl-7"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange(0);
                      } else {
                        field.onChange(parseFloat(value));
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Add"} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
}