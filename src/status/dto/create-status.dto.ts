import { z } from 'zod';

export const CreateStatusDto = z.object({
    name: z.enum(['Menikah', 'Bercerai', 'Belum Menikah']),
    total: z.number().int().nonnegative(),
});

export type CreateStatusDto = z.infer<typeof CreateStatusDto>;
