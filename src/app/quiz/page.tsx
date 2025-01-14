"use client";

import dynamic from "next/dynamic";

const Quiz = dynamic(() => import("~/components/Quiz"), {
  ssr: false,
});

export default function QuizHome() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Quiz />
    </main>
  );
}
