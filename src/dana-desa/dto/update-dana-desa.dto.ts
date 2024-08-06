import { z } from 'zod';

export const UpdateDanaDesaDto = z.object({
    nama: z.string().optional(),
    anggaran: z.number().min(0).optional(),
    realisasi: z.number().min(0).optional(),
    tipe: z.string().optional(),
});

export type UpdateDanaDesaDto = z.infer<typeof UpdateDanaDesaDto>;