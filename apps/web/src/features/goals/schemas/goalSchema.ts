import * as z from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, 'Nama target wajib diisi'),
  target_amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  current_amount: z.coerce.number().min(0),
  deadline: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;
