import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  Home, 
  PieChart, 
  Settings, 
  X 
} from "lucide-react";
import { useNavigationContext } from "@/context/NavigationContext";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { currentView, setCurrentView } = useNavigationContext();

  const handleNavigation = (view: string) => {
    setCurrentView(view);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-bold">Navigation</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="px-3 py-2">
              <SidebarNav currentView={currentView} onNavigate={handleNavigation} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-72 flex-col border-r bg-background fixed left-0 top-0 pt-16 z-20">
        <ScrollArea className="flex-1 pt-4">
          <div className="px-3 py-2">
            <SidebarNav currentView={currentView} onNavigate={setCurrentView} />
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

interface SidebarNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

function SidebarNav({ currentView, onNavigate }: SidebarNavProps) {
  const navItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      view: "dashboard",
    },
    {
      title: "Transactions",
      icon: <CreditCard className="h-5 w-5" />,
      view: "transactions",
    },
    {
      title: "Budgets",
      icon: <DollarSign className="h-5 w-5" />,
      view: "budgets",
    },
    {
      title: "Charts",
      icon: <BarChart3 className="h-5 w-5" />,
      view: "charts",
    },
    {
      title: "Categories",
      icon: <PieChart className="h-5 w-5" />,
      view: "categories",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      view: "settings",
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Button
          key={item.view}
          variant={currentView === item.view ? "secondary" : "ghost"}
          className={cn(
            "flex items-center justify-start gap-3 px-3",
            currentView === item.view && "bg-secondary"
          )}
          onClick={() => onNavigate(item.view)}
        >
          {item.icon}
          <span className="text-sm font-medium">{item.title}</span>
        </Button>
      ))}
    </div>
  );
}