import { z } from 'zod';

export const CreateLapakDto = z.object({
    name: z.string().nonempty(),
    price: z.string().nonempty(),
    phone: z.string().nonempty(),
    seller: z.string().nonempty(),
    description: z.string().nonempty(),
    location: z.string().nonempty(),
    contactPerson: z.string().nonempty(),
});

export type CreateLapakDto = z.infer<typeof CreateLapakDto>;