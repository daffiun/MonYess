import * as z from 'zod';

export const recurringSchema = z.object({
  name: z.string().min(1, 'Nama transaksi wajib diisi'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  account_id: z.string().min(1, 'Akun wajib dipilih'),
  category_id: z.string().optional(),
  target_account_id: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  next_date: z.string().min(1, 'Tanggal berikutnya wajib diisi'),
});

export type RecurringFormValues = z.infer<typeof recurringSchema>;
