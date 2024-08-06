import { z } from 'zod';

export const UpdatePrestasiDto = z.object({
    title: z.string().optional(),
    desc: z.string().optional(),
});

export type UpdatePrestasiDto = z.infer<typeof UpdatePrestasiDto>;