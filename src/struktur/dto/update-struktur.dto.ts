import { z } from 'zod';

export const UpdateStrukturDto = z.object({
    name: z.string().nonempty().optional(),
    alamat: z.string().nullable().optional(),
    jabatan: z.string().nonempty().optional(),
    foto: z.string().url().nullable().optional(),
});

export type UpdateStrukturDto = z.infer<typeof UpdateStrukturDto>;