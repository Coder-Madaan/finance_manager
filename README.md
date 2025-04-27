# Finance Tracker

A modern, feature-rich finance tracking application built with React and TypeScript. Track your expenses, manage budgets, and visualize your financial data with interactive charts.

## ✨ Features

- **📊 Interactive Dashboard**: Get a quick overview of your financial health
- **💰 Transaction Management**: Track income and expenses with detailed categorization
- **📅 Budget Planning**: Set and monitor category-wise budgets
- **📈 Visual Analytics**: Understand your spending patterns with interactive charts
- **🏷️ Custom Categories**: Organize transactions with customizable categories
- **💾 Local Storage**: Your data stays on your device

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

  ### Installation

1. Clone the repository:
```bash
git clone https://github.com/Coder-Madaan/finance_manager/
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Built With

- **Frontend Framework**: [React](https://reactjs.org/) with TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── budgets/        # Budget-related components
│   ├── categories/     # Category management
│   ├── charts/        # Data visualization
│   ├── dashboard/     # Dashboard views
│   ├── layout/        # Layout components
│   ├── settings/      # Settings page
│   ├── transactions/  # Transaction management
│   └── ui/           # Reusable UI components
├── context/           # React Context providers
├── hooks/            # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
