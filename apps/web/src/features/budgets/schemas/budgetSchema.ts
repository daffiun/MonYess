import * as z from 'zod';

export const budgetSchema = z.object({
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  period: z.string().min(1, 'Periode wajib diisi'),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
