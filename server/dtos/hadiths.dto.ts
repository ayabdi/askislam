import { z } from "zod";

export const SearchHadithsSchema = z.object({
    query_embedding: z.array(z.number()),
    similarity_threshold: z.number(),
    match_count: z.number()
})

    
export type SearchHadithsType = z.infer<typeof SearchHadithsSchema>;