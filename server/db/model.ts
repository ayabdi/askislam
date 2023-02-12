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
  embedding: z.array(z.number()).or(z.string()),
});

export const Chat = z.object({
  id: z.number(),
  userId: z.string(),
  from: z.string(), // either the user or the bot
  content: z.string(),
  created_at: z.string(),
});


export type Hadith = z.infer<typeof Hadith>;
export type Chat = z.infer<typeof Chat>;