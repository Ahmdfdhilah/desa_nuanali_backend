import { z } from 'zod';

export const UpdateEducationDto = z.object({
    name: z.enum(['Paud', 'TK', 'SD', 'SMP', 'SMA']).optional(),
    total: z.number().positive().finite().optional(),
});

export type UpdateEducationDto = z.infer<typeof UpdateEducationDto>;
