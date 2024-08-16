import { z } from 'zod';

export const CreateEducationDto = z.object({
    name: z.enum(['Paud', 'TK', 'SD', 'SMP', 'SMA']),
    total: z.number().positive().finite(),
});

export type CreateEducationDto = z.infer<typeof CreateEducationDto>;
