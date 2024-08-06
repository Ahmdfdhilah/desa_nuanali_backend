import { z } from 'zod';

export const CreateReligionDto = z.object({
    name: z.enum(['Islam', 'Katolik', 'Budha', 'Hindu', 'Kristen']),
    total: z.number().int().nonnegative(),
});

export type CreateReligionDto = z.infer<typeof CreateReligionDto>;