import { z } from 'zod';

export const UpdateStatusDto = z.object({
    name: z.enum(['Menikah', 'Bercerai', 'Belum Menikah']).optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateStatusDto = z.infer<typeof UpdateStatusDto>;
