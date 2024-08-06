import { z } from 'zod';

export const CreateStrukturDto = z.object({
    name: z.string().nonempty(),
    alamat: z.string().nullable(),
    jabatan: z.string().nonempty(),
    foto: z.string().url().nullable(),
});

export type CreateStrukturDto = z.infer<typeof CreateStrukturDto>;