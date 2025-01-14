"use client";

import { useGoldenWord } from "../hooks/words";

export function DisplayGoldenWord() {
  const { data: goldenWord } = useGoldenWord();

  return (
    <div className="text-lg text-center text-[#DAA520] mb-4">
      {goldenWord.goldenWord}
    </div>
  );
}
