import { Search } from 'lucide-react';
import { Input, Select } from '@/components/ui';
import type { Account } from '@/types';

export interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  accountFilter: string;
  onAccountFilterChange: (value: string) => void;
  accounts: Account[];
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  accountFilter,
  onAccountFilterChange,
  accounts,
}: TransactionFiltersProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Cari catatan atau kategori..." 
          className="pl-11"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select 
          className="w-32"
          options={[
            { label: 'Semua Tipe', value: 'all' },
            { label: 'Pemasukan', value: 'income' },
            { label: 'Pengeluaran', value: 'expense' },
            { label: 'Transfer', value: 'transfer' },
          ]}
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
        />
        <Select 
          className="w-40"
          options={[
            { label: 'Semua Akun', value: 'all' },
            ...accounts.map(a => ({ label: a.name, value: a.id }))
          ]}
          value={accountFilter}
          onChange={(e) => onAccountFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
}
