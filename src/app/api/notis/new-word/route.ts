import { NextResponse, NextRequest } from "next/server";
import { getNotificationTokenForFid } from "~/lib/database";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { word, fid } = body;

  if (!fid) {
    return NextResponse.json({ status: "no_fid" });
  }
  
  if (!word) {
    return NextResponse.json({ status: "no_word" });
  }

  try {
    const notificationToken = await getNotificationTokenForFid("words", fid);
    if (!notificationToken) {
      return NextResponse.json({ status: "no_token" });
    }

    const body = {
      notificationId: `${fid}:${word}`,
      title: "You've added a new word!",
      body: `Congrats! The word '${word}' has been added!`,
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
    console.log(`Notification delivered to ${fid}:`, body);

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
