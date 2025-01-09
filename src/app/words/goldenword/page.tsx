"use client";

import dynamic from "next/dynamic";

const GoldenWord = dynamic(() => import("~/components/GoldenWord"), {
  ssr: false,
});

export default function GoldenWordHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <GoldenWord />
    </main>
  );
}
