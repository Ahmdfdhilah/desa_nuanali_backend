import { z } from 'zod';

export const CreateSekolahDto = z.object({
    name: z.enum(['Paud', 'TK', 'SD', 'SMP', 'SMA']),
    total: z.number().int().nonnegative(),
});

export type CreateSekolahDto = z.infer<typeof CreateSekolahDto>;
