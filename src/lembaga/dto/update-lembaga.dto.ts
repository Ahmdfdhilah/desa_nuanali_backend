import { z } from 'zod';

export const UpdateLembagaDto = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    contact: z.string().optional(),
});

export type UpdateLembagaDto = z.infer<typeof UpdateLembagaDto>;
