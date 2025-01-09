"use client";

import dynamic from "next/dynamic";

const Words = dynamic(() => import("~/components/Words"), {
  ssr: false,
});

export default function WordsHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Words />
    </main>
  );
}
