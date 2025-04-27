import { Button } from "@/components/ui/button";
import { Menu, PiggyBank } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">FinanceTracker</span>
          </div>
        </div>
      </div>
    </header>
  );
}