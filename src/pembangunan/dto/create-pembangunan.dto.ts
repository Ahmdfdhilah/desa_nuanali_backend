import { z } from 'zod';

export const CreatePembangunanDto = z.object({
    judul: z.string().nonempty(),
    deskripsi: z.string().optional(),
    lokasi: z.string().nonempty(),
    anggaran: z.number().min(0),
    tahun: z.number().int().min(1900).max(2100),
    progres: z.number().int().min(0).max(100),
});

export type CreatePembangunanDto = z.infer<typeof CreatePembangunanDto>;
