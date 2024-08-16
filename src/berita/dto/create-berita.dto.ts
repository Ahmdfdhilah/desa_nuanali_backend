import { z } from 'zod';

export const CreateBeritaDto = z.object({
    author: z.string().nonempty(),
    date: z.string().datetime(),
    image: z.string().url().nullable(),
    title: z.string().nonempty(),
    body: z.string().nullable(),
});

export type CreateBeritaDto = z.infer<typeof CreateBeritaDto>;
