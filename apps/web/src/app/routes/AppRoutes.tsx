import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Lazy-loaded route components for optimal bundle splitting
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AccountsPage = lazy(() => import('@/features/accounts/pages/AccountsPage'));
const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage'));
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('@/features/budgets/pages/BudgetsPage'));
const GoalsPage = lazy(() => import('@/features/goals/pages/GoalsPage'));
const DebtsPage = lazy(() => import('@/features/debts/pages/DebtsPage'));
const RecurringPage = lazy(() => import('@/features/recurring/pages/RecurringPage'));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'));
const TelegramPage = lazy(() => import('@/features/telegram/pages/TelegramPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const ExportPage = lazy(() => import('@/features/export-import/pages/ExportPage'));
const NotFoundPage = lazy(() => import('@/features/not-found/pages/NotFoundPage'));

function PageSuspenseFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner />
    </div>
  );
}

export function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={user && !loading ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user && !loading ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* Protected Routes (wrapped in MainLayout and ProtectedRoute) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="recurring" element={<RecurringPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="telegram" element={<TelegramPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="export" element={<ExportPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
