export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet' | 'credit_card' | 'investment' | 'debt' | 'other';
  balance: number;
  color?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  note?: string;
  status: 'completed' | 'pending';
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string; // e.g., '2026-05'
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
}

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  type: 'payable' | 'receivable';
  amount: number;
  remaining: number;
  due_date?: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  active: boolean;
}

export interface UserStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  health_score: number;
  level: number;
  total_transactions: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export * from './utils';

