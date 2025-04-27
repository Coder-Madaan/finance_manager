import { Layout } from '@/components/layout/layout';
import { NavigationProvider, useNavigationContext } from '@/context/NavigationContext';
import { Dashboard } from '@/components/dashboard/dashboard';
import { TransactionPage } from '@/components/transactions/transaction-page';
import { BudgetPage } from '@/components/budgets/budget-page';
import { ChartsPage } from '@/components/charts/charts-page';
import { CategoriesPage } from '@/components/categories/categories-page';
import { SettingsPage } from '@/components/settings/settings-page';

function MainContent() {
  const { currentView } = useNavigationContext();

  return (
    <Layout>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'transactions' && <TransactionPage />}
      {currentView === 'budgets' && <BudgetPage />}
      {currentView === 'charts' && <ChartsPage />}
      {currentView === 'categories' && <CategoriesPage />}
      {currentView === 'settings' && <SettingsPage />}
    </Layout>
  );
}

function App() {
  return (
    <NavigationProvider>
      <MainContent />
    </NavigationProvider>
  );
}

export default App;