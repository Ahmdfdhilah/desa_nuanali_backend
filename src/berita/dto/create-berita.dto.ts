import { z } from 'zod';

export const CreateBeritaDto = z.object({
    slug: z.string().nonempty(),
    author: z.string().nonempty(),
    date: z.string().datetime(),
    image: z.string().url().nullable(),
    title: z.string().nonempty(),
    category: z.string().nonempty(),
    excerpt: z.string().nullable(),
    body: z.string().nullable(),
});

export type CreateBeritaDto = z.infer<typeof CreateBeritaDto>;
