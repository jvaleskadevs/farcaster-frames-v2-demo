import { Client } from "@upstash/qstash";

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export type QueueMessage = {
  url: string;
  body: Record<string, unknown> | string;
  messageId: string;
  notBefore?: number;
  retries?: number;
};

export async function queueMessage({
  url,
  body,
  messageId,
  notBefore,
  retries = 3,
}: QueueMessage) {
  return client.publishJSON({
    url: `https://farcaster-frames-v2-demo.vercel.app${url}`,
    body,
    ...(notBefore && { notBefore }),
    retries,
    deduplicationId: messageId.replaceAll(":", "_"),
  });
}

export async function scheduleDailyNotificationProcessing({
  url,
  body,
  messageId,
  notBefore,
  retries = 3,
}: QueueMessage) {
  return client.schedules.create({
    destination: `https://farcaster-frames-v2-demo.vercel.app${url}`,
    body: body as string,
    cron: "0 0 * * *",
    ...(notBefore && { notBefore }),
    retries,
    scheduleId: messageId.replaceAll(":", "_"),
  });
}

/*
export async function scheduleNotificationProcessing() {
  return client.schedules.create({
    destination: `https://farcaster-frames-v2-demo.vercel.app/api/notis/process`,
    cron: "* * * * *",
    retries: 3,
    scheduleId: "process-notifications",
  });
}
*/
