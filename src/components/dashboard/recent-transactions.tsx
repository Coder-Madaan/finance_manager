import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useNavigationContext } from "@/context/NavigationContext";

export function RecentTransactions() {
  const { transactions, getCategoryName, getCategoryColor } = useFinance();
  const { setCurrentView } = useNavigationContext();
  
  // Sort by date (most recent first) and get top 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleViewAll = () => {
    setCurrentView("transactions");
  };

  return (
    <div className="space-y-8">
      {recentTransactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No transactions yet</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => setCurrentView("transactions")}
          >
            Add your first transaction
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-full p-2 bg-muted">
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                      <span className="mx-1">•</span>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: getCategoryColor(transaction.category),
                          color: getCategoryColor(transaction.category),
                        }}
                      >
                        {getCategoryName(transaction.category)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleViewAll}>
              View All Transactions
            </Button>
          </div>
        </>
      )}
    </div>
  );
}