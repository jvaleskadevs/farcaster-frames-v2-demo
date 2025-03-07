"use client";

import dynamic from "next/dynamic";

const ComponentSelector = dynamic(() => import("~/components/ComponentSelector"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <ComponentSelector />
    </main>
  );
}
