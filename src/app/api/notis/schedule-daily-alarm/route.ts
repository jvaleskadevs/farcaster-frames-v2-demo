import { NextRequest, NextResponse } from "next/server";
import { scheduleDailyNotificationProcessing } from "~/lib/queue";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, text } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "Missing fid" },
        { status: 400 },
      );
    }

    const reminderId = `daily-alarm:${fid}`;

    await scheduleDailyNotificationProcessing({
      url: "/api/notis/process-alarm",
      body: JSON.stringify({
        reminderId,
        fid,
        text
      }),
      messageId: reminderId
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
