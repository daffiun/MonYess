import type {
  Account,
  Category,
  Transaction,
  Budget,
  Goal,
  Debt,
  RecurringTransaction,
  UserStats,
  Achievement,
  UserAchievement,
  UserProfile,
} from '@financebot/shared';

export type {
  Account,
  Category,
  Transaction,
  Budget,
  Goal,
  Debt,
  RecurringTransaction,
  UserStats,
  Achievement,
  UserAchievement,
  UserProfile,
};

/**
 * Transaction entity enriched with relational joins (Account and Category names)
 */
export interface TransactionWithRelations extends Omit<Transaction, 'account_id' | 'category_id'> {
  account_id: string;
  category_id?: string;
  target_account_id?: string;
  account?: { name: string } | null;
  target_account?: { name: string } | null;
  category?: { name: string } | null;
  created_at?: string;
}

/**
 * Budget entity enriched with Category relation
 */
export interface BudgetWithCategory extends Budget {
  category?: { name: string } | null;
  created_at?: string;
}

/**
 * Telegram link status entity
 */
export interface TelegramLinkRecord {
  id: string;
  user_id: string;
  telegram_chat_id?: number | null;
  telegram_username?: string | null;
  link_code?: string | null;
  code_expires_at?: string | null;
  is_linked: boolean;
  created_at?: string;
}

/**
 * Debt entity with settled status flag
 */
export interface DebtRecord extends Debt {
  is_settled?: boolean;
  created_at?: string;
}

/**
 * Recurring transaction enriched with account and category IDs
 */
export interface RecurringTransactionRecord extends RecurringTransaction {
  account_id?: string;
  category_id?: string;
  target_account_id?: string;
  created_at?: string;
}
