import { z } from 'zod';

export const CreateUsiaDto = z.object({
    name: z.enum([
        '< 10 Tahun',
        '11 - 20 Tahun',
        '21 - 30 Tahun',
        '31 - 40 Tahun',
        '41 - 50 Tahun',
        '> 50 Tahun'
    ]),
    total: z.number().int().nonnegative(),
});

export type CreateUsiaDto = z.infer<typeof CreateUsiaDto>;
