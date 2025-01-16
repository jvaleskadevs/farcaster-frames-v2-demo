"use client";

import dynamic from "next/dynamic";

const SwapToken = dynamic(() => import("~/components/SwapToken"), {
  ssr: false,
});

export default function SwapTokenHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <SwapToken />
    </main>
  );
}
