import { NextResponse } from "next/server";
import { getGoldenWord } from "~/lib/words";

export const dynamic = "force-dynamic";

export type GoldenWordResponse = {
  goldenWord: string;
};

export async function GET() {
  try {
    const goldenWord = await getGoldenWord();

    return NextResponse.json({
      goldenWord: goldenWord,
    });
  } catch (error) {
    console.error("Error fetching Golden Word:", error);
    return NextResponse.json(
      { error: "Failed to fetch Golden Word" },
      { status: 500 },
    );
  }
}
