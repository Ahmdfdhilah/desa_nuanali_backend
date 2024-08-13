import { z } from 'zod';

export const CreateLembagaDto = z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
    contact: z.string().nonempty(),
});

export type CreateLembagaDto = z.infer<typeof CreateLembagaDto>;
