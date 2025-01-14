"use client";

import { useFreeWord } from "../hooks/words";

export function DisplayFreeWord() {
  const { data: freeWord } = useFreeWord();

  return (
    <div className="text-lg text-center text-[#8B99A4] mb-4">
      {freeWord.freeWord}
    </div>
  );
}
