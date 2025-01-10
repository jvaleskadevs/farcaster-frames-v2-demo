import { useSuspenseQuery } from "@tanstack/react-query";
import { FreeWordResponse } from "~/app/api/words/freeword/route";
import { GoldenWordResponse } from "~/app/api/words/goldenword/route";

export function useFreeWord() {
  return useSuspenseQuery({
    queryKey: ["freeword"],
    queryFn: async () => {
      const response = await fetch("/api/words/freeword", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch the Free Word.");
      }
      return response.json() as Promise<FreeWordResponse>;
    },
  });
}

export function useGoldenWord() {
  return useSuspenseQuery({
    queryKey: ["goldenword"],
    queryFn: async () => {
      const response = await fetch("/api/words/goldenword", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch the Golden Word.");
      }
      return response.json() as Promise<GoldenWordResponse>;
    },
  });
}


