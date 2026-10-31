import { Banknote, Landmark, Smartphone, CreditCard, Wallet, type LucideIcon } from 'lucide-react';

export const ACCOUNT_TYPES = [
  { label: 'Tunai (Cash)', value: 'cash' },
  { label: 'Bank', value: 'bank' },
  { label: 'E-Wallet', value: 'ewallet' },
  { label: 'Kartu Kredit', value: 'credit_card' },
  { label: 'Investasi', value: 'investment' },
  { label: 'Hutang', value: 'debt' },
  { label: 'Lainnya', value: 'other' },
];

export const TYPE_ICONS: Record<string, LucideIcon> = {
  cash: Banknote,
  bank: Landmark,
  ewallet: Smartphone,
  credit_card: CreditCard,
  investment: Wallet,
  debt: CreditCard,
  other: Wallet,
};

export const TYPE_COLORS: Record<string, string> = {
  cash: 'bg-amber-500',
  bank: 'bg-blue-600',
  ewallet: 'bg-emerald-500',
  credit_card: 'bg-rose-500',
  investment: 'bg-indigo-600',
  debt: 'bg-slate-800',
  other: 'bg-slate-500',
};
