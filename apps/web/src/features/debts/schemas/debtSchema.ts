import * as z from 'zod';

export const debtSchema = z.object({
  name: z.string().min(1, 'Nama/Keterangan wajib diisi'),
  type: z.enum(['payable', 'receivable']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  remaining: z.coerce.number().min(0),
  due_date: z.string().optional(),
});

export type DebtFormValues = z.infer<typeof debtSchema>;
