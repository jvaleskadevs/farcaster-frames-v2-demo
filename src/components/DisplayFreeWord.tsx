"use client";

import { useFreeWord } from "../hooks/words";

export function DisplayFreeWord() {
  const { data: freeWord } = useFreeWord();

  return (
    <div className="text-md text-center text-[#8B99A4]">
      {freeWord.freeWord}
    </div>
  );
}
