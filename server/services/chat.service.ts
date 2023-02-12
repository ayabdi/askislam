import path from "path";
import { supabase } from "../db";
import { Chat, Hadith } from "../db/model";
import { SearchHadithsResponseSchema, SearchHadithsResponseType, SearchHadithsType } from "../dtos/hadiths.dto";
import { gptCompletion, gptEmbedding } from "../lib/openai";
import { readFileSync } from "fs";

export const executePrompt = async (prompt: string, userId: string): Promise<string> => {
  await saveMessage(userId, "USER", prompt);

  const vector = await gptEmbedding(prompt);
  const hadiths = await searchHadiths(vector);
  const conversation = await loadConversation(userId, 5);

  const templateFile = path.join(process.cwd(), "server", "services", "prompt_response.txt");
  const template = readFileSync(templateFile, "utf8");

  const fullPrompt = template
    .replace("<<HADITHS>>", hadiths)
    .replace("<<CONVERSATION>>", conversation);

    console.log(fullPrompt);
  const response = await gptCompletion(fullPrompt);
  console.log(response)
  await saveMessage(userId, "ASKISLAM BOT", response);
  return response;
};

export const searchHadiths = async (query_embedding: number[]) => {
  const { data, error } = await supabase.rpc("matching_hadiths", {
    query_embedding,
    similarity_threshold: 0,
    match_count: 10,
  } as SearchHadithsType);

  if (error) throw new Error(error.message);

   const  hadiths = await Promise.all(data.map(async (hadith: any) => {
      const res = SearchHadithsResponseSchema.parse(hadith);
      // summarize hadiths greater than 2000 characters
      let hadithText = res.hadith.hadith;
      if (res.hadith.hadith.length > 2000) {
        hadithText = await gptCompletion(`Summarise the following hadith: ${res.hadith.hadith}`)
      }
      return `${res.hadith.muhadith} Vol. ${res.hadith.volume}, Book ${res.hadith.book}, Hadith ${res.hadith.number}
      \n Narrated by ${res.hadith.narrator} \n ${hadithText} \n\n`
    }))

  return hadiths.join("\n\n");
};

const saveMessage = async (userId: string, from: string, content: string) => {
  const { data, error } = await supabase.from("Chat").insert([
    {
      userId,
      from,
      content
    },
  ]);

  if (error) throw new Error(error.message);
  return data;
};

const loadConversation = async (userId: string, limit: number) => {
  const { data, error } = await supabase
    .from("Chat")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false  })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data
    .map((chat: any) => Chat.parse(chat))
    .map((chat: Chat) => `${chat.from}: ${chat.content}`)
    .reverse()
    .join("\n\n") as string;
};
