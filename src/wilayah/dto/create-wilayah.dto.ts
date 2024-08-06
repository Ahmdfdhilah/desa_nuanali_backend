import { z } from 'zod';

export const CreateWilayahDto = z.object({
    name: z.string().nonempty(),
    rt: z.string().nonempty(),
    kk: z.string().nonempty(),
    male: z.number().int().nonnegative(),
    female: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
});

export type CreateWilayahDto = z.infer<typeof CreateWilayahDto>;