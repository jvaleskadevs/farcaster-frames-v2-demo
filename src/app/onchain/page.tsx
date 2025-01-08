"use client";

import dynamic from "next/dynamic";

const Onchain = dynamic(() => import("~/components/Onchain"), {
  ssr: false,
});

export default function OnchainHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Onchain />
    </main>
  );
}
