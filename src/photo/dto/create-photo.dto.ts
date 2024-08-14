import { z } from 'zod';

export const CreatePhotoDto = z.object({
    title: z.string().optional(),
});

export type CreatePhotoDto = z.infer<typeof CreatePhotoDto>;
