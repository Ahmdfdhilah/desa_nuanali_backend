import { z } from 'zod';

export const UpdateGenderDto = z.object({
    name: z.enum(['Laki-Laki', 'Perempuan']).optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateGenderDto = z.infer<typeof UpdateGenderDto>;
