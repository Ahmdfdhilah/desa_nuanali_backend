import { z } from 'zod';

export const UpdateBeritaDto = z.object({
    slug: z.string().nonempty().nullable(),
    author: z.string().nonempty().nullable(),
    date: z.string().datetime().nullable(),
    image: z.string().url().nullable(),
    title: z.string().nonempty().nullable(),
    category: z.string().nonempty().nullable(),
    excerpt: z.string().nullable(),
    body: z.string().nullable(),
});

export type UpdateBeritaDto = z.infer<typeof UpdateBeritaDto>;
