"use client";

import dynamic from "next/dynamic";

const Tutorials = dynamic(() => import("~/components/Tutorials"), {
  ssr: false,
});

export default function TutorialsHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Tutorials />
    </main>
  );
}
