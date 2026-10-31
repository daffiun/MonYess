import * as z from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, 'Nama akun wajib diisi'),
  type: z.enum(['cash', 'bank', 'ewallet', 'credit_card', 'investment', 'debt', 'other']),
  balance: z.coerce.number().min(0, 'Saldo tidak boleh negatif'),
  color: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
