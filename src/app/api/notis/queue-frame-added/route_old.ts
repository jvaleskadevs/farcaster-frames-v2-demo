import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import {
  getLastProcessedWord,
  setLastProcessedWord,
} from "~/lib/database";
import { queueMessage } from "~/lib/queue";
import { getFreeWord } from "~/lib/words";

async function handler() {
  try {
    const lastProcessedWord = await getLastProcessedWord();
    console.log("Last processed word:", lastProcessedWord);

    if (!lastProcessedWord) {
      console.log("No last processed word found");
      return Response.json({ status: "no_last_word" });
    }

    const currentWord: string = await getFreeWord();
    console.log(`Found current word: ${currentWord}`);

    if (currentWord === lastProcessedWord) {
      return Response.json({ status: "no_new_words" });
    }

    console.log(`Queueing notification for word ${currentWord}.`);

    await queueMessage({
      messageId: currentWord,
      url: "api/notis/new-word",
      body: {
        word: currentWord,
        fid: 16628
      },
    });

    console.log(`Setting last processed word to ${currentWord}`);
    await setLastProcessedWord(currentWord);

    return Response.json({
      status: "success",
      processed: 1,
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
