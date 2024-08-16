import { z } from 'zod';

export const CreateGenderDto = z.object({
    name: z.enum(['Laki-Laki', 'Perempuan']),
    total: z.number().int().nonnegative(),
});

export type CreateGenderDto = z.infer<typeof CreateGenderDto>;
