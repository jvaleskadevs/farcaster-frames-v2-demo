"use client";

import { useGoldenWord } from "../hooks/words";

export function DisplayGoldenWord() {
  const { data: goldenWord } = useGoldenWord();

  return (
    <div className="text-sm text-center text-[#DAA520]">
      {goldenWord.goldenWord}
    </div>
  );
}
