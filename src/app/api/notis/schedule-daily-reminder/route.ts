import { NextRequest, NextResponse } from "next/server";
import { scheduleDailyNotificationProcessing } from "~/lib/queue";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "Missing fid" },
        { status: 400 },
      );
    }

    const reminderId = `daily-reminder:${fid}`;

    await scheduleDailyNotificationProcessing({
      url: "/api/notis/process-reminder",
      body: JSON.stringify({
        reminderId,
        fid
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
