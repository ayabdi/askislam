import { z } from "zod";
import { Hadith } from "../db/model";

export const SearchHadithsSchema = z.object({
    query_embedding: z.array(z.number()),
    similarity_threshold: z.number(),
    match_count: z.number()
})

export const SearchHadithsResponseSchema = z.object({
    hadith: Hadith,
    similarity: z.number()
})
    
export type SearchHadithsType = z.infer<typeof SearchHadithsSchema>;
export type SearchHadithsResponseType = z.infer<typeof SearchHadithsResponseSchema>;