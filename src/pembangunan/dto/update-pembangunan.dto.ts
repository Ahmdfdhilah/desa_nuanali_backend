import { z } from 'zod';

export const UpdatePembangunanDto = z.object({
    judul: z.string().optional(),
    deskripsi: z.string().optional(),
    lokasi: z.string().optional(),
    anggaran: z.number().min(0).optional(),
    tahun: z.number().int().min(1900).max(2100).optional(),
    progres: z.number().int().min(0).max(100).optional(),
    existingFotos: z.array(z.string()).optional(), 
});

export type UpdatePembangunanDto = z.infer<typeof UpdatePembangunanDto>;