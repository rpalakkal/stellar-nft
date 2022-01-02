import Head from "next/head";
import Header from "../components/Header";
import Wizard from "../components/Wizard";

export default function Home() {
  return (
    <div className="flex flex-col h-screen font-mono bg-purple-100">
      <Head>
        <title>NFT Wizard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-initial">
        <Header />
      </div>
      
      <div className="flex-auto flex justify-center h-full pt-10">
        <Wizard />
      </div>
    </div>
  );
}
