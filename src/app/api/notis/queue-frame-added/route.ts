import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { queueMessage } from "~/lib/queue";
import { v4 as uuidv4 } from "uuid";

async function handler(request: Request) {
  const body = await request.json();
  const { fid } = body;

  if (!fid) {
    return NextResponse.json({ status: "no_fid" });
  }
  
  try {
    console.log(`Queueing add-frame notification for ${fid}.`);

    await queueMessage({
      messageId: uuidv4(),
      url: "api/notis/process-frame-added",
      body: {
        fid
      },
    });

    return Response.json({
      status: "success"
    });
  } catch (error) {
    console.error("Error processing notifications:", error);
    return Response.json(
      { error: "Failed to process notifications" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
