import { z } from 'zod';

export const CreatePrestasiDto = z.object({
    title: z.string().nonempty(),
});

export type CreatePrestasiDto = z.infer<typeof CreatePrestasiDto>;