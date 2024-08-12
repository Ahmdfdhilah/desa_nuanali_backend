import { z } from 'zod';

export const UpdateSekolahDto = z.object({
    name: z.enum(['Paud', 'TK', 'SD', 'SMP', 'SMA']).optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateSekolahDto = z.infer<typeof UpdateSekolahDto>;
