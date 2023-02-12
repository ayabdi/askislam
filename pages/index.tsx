import Head from "next/head";
import { Inter } from "@next/font/google";
import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  
  const [prompt, setPrompt] = useState("");
  const [ response , setResponse ] = useState("")
  const handleChange = (e: { target: { value: string } }) => {
    setPrompt(e.target.value)
  };
  const handleSearch = (e: any) => {
    // make an api request to next/chat endpoint
    // pass the prompt.current as a query param
    e.preventDefault();
    const url = `/api/chat?prompt=${prompt}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
          setResponse(data.response)
      });
  };
  return (
    <>
      <Head>
        <title>Ask Islam</title>
        <meta name="description" content="Ask Islam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center">
        <div className="container mx-auto h-full" style={{ padding: "50px 0 100px 0" }}>
          {!session ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={["google"]}
            />
          ) : (
            <div className="mt-10 w-3/4 mx-auto h-full">
              <div className="mt-auto mb-2 h-full lex-1 flex-col overflow-y-auto whitespace-pre-wrap">
                {response}
              </div>
              <form className="mt-auto" onSubmit={handleSearch}>
              <input type="text" placeholder="Ask me something.." className="w-full rounded border px-2 py-2" onChange={handleChange} />
              </form>
            </div>
          )}
        </div>
      </main>
      §
    </>
  );
}
