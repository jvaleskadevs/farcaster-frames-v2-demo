"use client";

import dynamic from "next/dynamic";

const Yoink = dynamic(() => import("~/components/Yoink"), {
  ssr: false,
});

export default function YoinkHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Yoink />
    </main>
  );
}
