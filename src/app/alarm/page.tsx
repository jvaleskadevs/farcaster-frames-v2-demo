"use client";

import dynamic from "next/dynamic";

const Alarm = dynamic(() => import("~/components/Alarm"), {
  ssr: false,
});

export default function AlarmHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Alarm />
    </main>
  );
}
