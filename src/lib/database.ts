import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const setNotificationTokenForFid = async (
  app: string,
  fid: number,
  token: string,
) => {
  return redis.set(`${app}:tokens:fid:${fid}`, token);
};

export const getNotificationTokenForFid = async (app: string, fid: number) => {
  return redis.get<string>(`${app}:tokens:fid:${fid}`);
};

export const deleteNotificationTokenForFid = async (app: string, fid: number) => {
  return redis.del(`${app}:tokens:fid:${fid}`);
};

// words

export const getLastProcessedWord = async () => {
  return redis.get<string>("words:notifications:last_word");
};

export const setLastProcessedWord = async (word: string) => {
  return redis.set("words:notifications:last_word", word);
};
