"use client";

import dynamic from "next/dynamic";

const FreeWord = dynamic(() => import("~/components/FreeWord"), {
  ssr: false,
});

export default function FreeWordHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <FreeWord />
    </main>
  );
}
