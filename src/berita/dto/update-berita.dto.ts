import { z } from 'zod';

export const UpdateBeritaDto = z.object({
    author: z.string().nonempty().nullable(),
    date: z.string().datetime().nullable(),
    image: z.string().url().nullable(),
    title: z.string().nonempty().nullable(),
    body: z.string().nullable(),
});

export type UpdateBeritaDto = z.infer<typeof UpdateBeritaDto>;
