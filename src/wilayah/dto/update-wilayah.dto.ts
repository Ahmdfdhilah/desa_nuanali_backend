import { z } from 'zod';

export const UpdateWilayahDto = z.object({
    name: z.string().nonempty().optional(),
    rt: z.string().nonempty().optional(),
    kk: z.string().nonempty().optional(),
    male: z.number().int().nonnegative().optional(),
    female: z.number().int().nonnegative().optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateWilayahDto = z.infer<typeof UpdateWilayahDto>;