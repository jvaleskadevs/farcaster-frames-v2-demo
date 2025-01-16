import { NextResponse } from "next/server";
import { getNotificationTokenForFid } from "~/lib/database";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(request: Request) {
  const body = await request.json();
  const { reminderId, text, fid } = body;

  try {
    const notificationToken = await getNotificationTokenForFid("words", fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    const body = {
      notificationId: reminderId,
      title: "Alaaarmaaa!",
      body: text || "This is a basic alarm message!",
      targetUrl: "https://farcaster-frames-v2-demo.vercel.app/",
      tokens: [notificationToken],
    };
    const response = await fetch(
      "https://api.warpcast.com/v1/frame-notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.status === 429) {
      throw new Error("Rate limited by Warpcast API");
    }

    if (!response.ok) {
      throw new Error(`Warpcast API error: ${response.status}`);
    }
    console.log(`Delivered reminder to fid ${fid}:`, body);

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing reminder notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
