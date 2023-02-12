import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import ContentEditable from "react-contenteditable";
import { useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const prompt = useRef("");
  const handleChange = (e: { target: { value: string } }) => {
    prompt.current = e.target.value;
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
        {/* Search bar */}
        <div className="mt-10 w-1/2">
          <ContentEditable html={prompt.current} onChange={handleChange} placeholder="Search" className="w-full border rounded px-2 py-2" />

          {/* Search results */}
        </div>
      </main>
    </>
  );
}
