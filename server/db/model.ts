import { z } from "zod";

export const Hadith = z.object({
  id: z.number(),
  muhadith: z.string(),
  volume: z.number(),
  book: z.number(),
  number: z.number(),
  hadith: z.string(),
  narrator: z.string(),
  created_at: z.string(),
  embedding: z.array(z.number()),
});

export type Hadith = z.infer<typeof Hadith>;