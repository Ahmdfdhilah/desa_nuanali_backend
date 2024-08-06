import { z } from 'zod';

export const UpdateReligionDto = z.object({
    name: z.enum(['Islam', 'Katolik', 'Budha', 'Hindu', 'Kristen']).optional(),
    total: z.number().int().nonnegative().optional(),
});

export type UpdateReligionDto = z.infer<typeof UpdateReligionDto>;
