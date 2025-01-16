import { NextRequest, NextResponse } from "next/server";
import { queueMessage } from "~/lib/queue";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, text, timeLeft } = body;

    if (!fid || typeof timeLeft !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sendAt = Math.floor(Date.now() / 1000) + timeLeft;
    const reminderId = `alarm:${fid}:${sendAt}`;

    await queueMessage({
      messageId: reminderId,
      url: "/api/alarm/process-alarm",
      body: {
        reminderId,
        fid,
        text
      },
      notBefore: sendAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
