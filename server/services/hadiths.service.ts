import { supabase } from "../db";
import { Hadith } from "../db/model";
import { SearchHadithsType } from "../dtos/hadiths.dto";
import { gptEmbedding } from "../lib/openai";

export const searchHadiths = async (query: string): Promise<Hadith[]> => {
  const query_embedding = await gptEmbedding(query);
  const { data, error } = await supabase.rpc("match_hadiths", {
    query_embedding,
    similarity_threshold: 0,
    match_count: 10,
  } as SearchHadithsType);

  if (error) throw new Error(error.message);
  return data.map((hadith: any) => Hadith.parse(hadith));
};
