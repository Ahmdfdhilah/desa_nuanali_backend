import { z } from 'zod';

export const UpdateWisataDto = z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    existingFotos: z.array(z.string()).optional(),
});

export type UpdateWisataDto = z.infer<typeof UpdateWisataDto>;