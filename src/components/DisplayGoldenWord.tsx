"use client";

import { useGoldenWord } from "../hooks/words";

export function DisplayGoldenWord() {
  const { data: goldenWord } = useGoldenWord();

  return (
    <div className="text-md text-center text-[#DAA520]">
      {goldenWord.goldenWord}
    </div>
  );
}
