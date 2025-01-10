import { NextResponse } from "next/server";
import { getFreeWord } from "~/lib/words";

export const dynamic = "force-dynamic";

export type FreeWordResponse = {
  freeWord: string;
};

export async function GET() {
  try {
    const freeWord = await getFreeWord();

    return NextResponse.json({
      freeWord: freeWord,
    });
  } catch (error) {
    console.error("Error fetching Free Word:", error);
    return NextResponse.json(
      { error: "Failed to fetch Free Word" },
      { status: 500 },
    );
  }
}
