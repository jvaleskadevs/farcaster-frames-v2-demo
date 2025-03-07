import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
//import { Context } from '@farcaster/frame-core';
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
} from "wagmi";
import { useRouter } from 'next/navigation';
import { encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
import { DisplayFreeWord } from "~/components/DisplayFreeWord";
import { config } from "~/components/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { wordsAbi } from "~/abis/wordsAbi";
import { truncateAddress } from "~/lib/truncateAddress";

export default function FreeWord() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  //const [context, setContext] = useState<Context.FrameContext>();
  const [inputText, setInputText] = useState<string | null>(null);
  const [newWord, setNewWord] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();
  
  const {
    switchChain,
    error: switchChainError,
    isError: isSwitchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();

  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  useEffect(() => {
    const load = async () => {
      //setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);
  
  const contractAddress = "0xb25aa62b7422482767936e620769f0b0ee490edf";

  const openUrl = useCallback(() => {
    if (txHash) {
      sdk.actions.openUrl(`https://basescan.org/tx/${txHash}`);
    } else {
      sdk.actions.openUrl(`https://basescan.org/address/${contractAddress}`);
    }
  }, [contractAddress, txHash]);
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/FreeWord.tsx");
  }, []);

  const sendTx = useCallback(() => {
    if (chainId !== base.id) switchChain({ chainId: base.id });
    sendTransaction(
      {
        to: contractAddress,
        data: encodeFunctionData({
          abi: wordsAbi,
          functionName: "freeWord",
          args: [inputText]
        }),
        chainId: base.id
      },
      {
        onSuccess: (hash) => {
          setNewWord(inputText);
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction, inputText, chainId, switchChain]);
  
  const backToHome = () => {
    router.push("/");
  }
  
  const onInputChange = (value: string) => {
    setInputText(value);
  }
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`, //`
  });
  
  useEffect(() => {
    const notifyNewWord = async () => {
      const fid = (await sdk.context)?.user?.fid;
      if (!fid || !newWord) return;
      await fetch("/api/words/new-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid,
          word: newWord
        }),
      });
      setNewWord(null);
    }
    notifyNewWord();
  }, [isConfirmed, newWord]);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Free Word</h1>
      <h3 className="font-semibold text-xs text-center mb-4">by jvaleska</h3>

      <div>
        <h2 className="text-md font-bold mb-2">Current Free Word</h2>
        <DisplayFreeWord />
      </div>

      <div>
        {isConnected && (
          <>
            <div className="mb-4">
              <Label>
                Just write something...
              </Label>
              <Input maxLength={32} onChange={(e) => onInputChange(e.target.value)} disabled={isSendTxPending} />
              {inputText &&
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  {inputText}
                </pre>
              </div>}
            </div>
          
            <div className="mb-8">
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSwitchChainPending || isSendTxPending}
                isLoading={isSendTxPending}
              >
                Send
              </Button>
              {isSendTxError && renderError(sendTxError)}
              {isSwitchChainError && renderError(switchChainError)}
              {txHash && (
                <div className="mt-2 text-xs">
                  <div>Hash: {truncateAddress(txHash)}</div>
                  <div>
                    Status:{" "}
                    {isConfirming
                      ? "Confirming..."
                      : isConfirmed
                      ? "Confirmed!"
                      : "Pending"}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  { txHash ? "See tx in basescan" : "See contract in basescan" }
                </pre>
              </div> 
              <Button onClick={openUrl}>Block Explorer</Button>
            </div>
          </>
        )}
        
        {address && (
          <div className="my-2 text-xs">
            Address: <pre className="inline">{truncateAddress(address)}</pre>
          </div>
        )}
        
        <div className="mb-8">
          <Button
            onClick={() =>
              isConnected
                ? disconnect()
                : connect({ connector: config.connectors[0] })
            }
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            Open this component in github
          </pre>
        </div>
        <Button onClick={openGithub}>View Code</Button>
      </div>
              
      <div className="mb-4">
        <Button onClick={backToHome}>Back</Button>
      </div>
    </div>
  );
}
