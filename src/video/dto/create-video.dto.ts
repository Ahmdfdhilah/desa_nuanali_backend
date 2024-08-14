import { z } from 'zod';

export const CreateVideoDto = z.object({
    link: z.string().min(1, "Link is required").max(255, "Link must be less than 255 characters"),
    isVertical: z.boolean()
});

export type CreateVideoDto = z.infer<typeof CreateVideoDto>;
