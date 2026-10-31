import * as z from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  account_id: z.string().min(1, 'Akun wajib dipilih'),
  target_account_id: z.string().optional(),
  category_id: z.string().optional(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  note: z.string().optional(),
}).refine(data => {
  if (data.type === 'transfer' && !data.target_account_id) return false;
  if (data.type === 'transfer' && data.account_id === data.target_account_id) return false;
  if (data.type !== 'transfer' && !data.category_id) return false;
  return true;
}, {
  message: 'Input tidak valid (cek akun transfer atau kategori)',
  path: ['category_id'],
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
