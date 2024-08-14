import { z } from 'zod';

export const UpdateLapakDto = z.object({
    name: z.string().optional(),
    price: z.string().optional(),
    phone: z.string().optional(),
    seller: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    contactPerson: z.string().optional(),
});

export type UpdateLapakDto = z.infer<typeof UpdateLapakDto>;