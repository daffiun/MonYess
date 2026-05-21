import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Debts from './pages/Debts';
import Recurring from './pages/Recurring';
import Reports from './pages/Reports';
import Telegram from './pages/Telegram';
import Settings from './pages/Settings';
import Export from './pages/Export';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes (wrapped in MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="debts" element={<Debts />} />
        <Route path="recurring" element={<Recurring />} />
        <Route path="reports" element={<Reports />} />
        <Route path="telegram" element={<Telegram />} />
        <Route path="settings" element={<Settings />} />
        <Route path="export" element={<Export />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
