import * as z from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
