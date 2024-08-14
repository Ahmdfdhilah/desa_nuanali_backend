import { z } from 'zod';

export const CreateWisataDto = z.object({
    title: z.string().nonempty(),
    body: z.string().optional(),
});

export type CreateWisataDto = z.infer<typeof CreateWisataDto>;