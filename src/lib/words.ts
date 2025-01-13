import { createPublicClient, http, type Address } from "viem";
import { base } from "viem/chains";
import { wordsAbi } from "~/abis/wordsAbi";

const WORDS_ADDRESS: Address = "0xb25aa62b7422482767936e620769f0b0ee490edf";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(
    process.env.BASE_ALCHEMY_RPC ?? "https://mainnet.base.org",
  ),
});

export const getFreeWord = async () => {
  return await publicClient.readContract({
    address: WORDS_ADDRESS,
    abi: wordsAbi,
    functionName: "theWord",
  }) as string;
};

export const getGoldenWord = async () => {
  return await publicClient.readContract({
    address: WORDS_ADDRESS,
    abi: wordsAbi,
    functionName: "theGoldenWord",
  }) as string;
};
