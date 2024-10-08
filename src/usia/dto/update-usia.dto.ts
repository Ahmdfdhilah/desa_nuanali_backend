import { z } from 'zod';

export const UpdateUsiaDto = z.object({
    name: z.enum([
        '< 10 Tahun',
        '11 - 20 Tahun',
        '21 - 30 Tahun',
        '31 - 40 Tahun',
        '41 - 50 Tahun',
        '> 50 Tahun'
    ]).optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateUsiaDto = z.infer<typeof UpdateUsiaDto>;
