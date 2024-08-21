import { z } from 'zod';

export const BannerDtoSchema = z.object({
  img: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  order: z.number().optional(),
});

export type BannerDto = z.infer<typeof BannerDtoSchema>;