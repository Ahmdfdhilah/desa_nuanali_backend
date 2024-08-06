import { z } from 'zod';

export const CreateDanaDesaDto = z.object({
    nama: z.string().nonempty(),
    anggaran: z.number().min(0), 
    realisasi: z.number().min(0),
    tipe: z.string().nonempty(),
});

export type CreateDanaDesaDto = z.infer<typeof CreateDanaDesaDto>;
