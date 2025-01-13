"use client";

import dynamic from "next/dynamic";

const Docs = dynamic(() => import("~/components/Docs"), {
  ssr: false,
});

export default function DocsHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Docs />
    </main>
  );
}
