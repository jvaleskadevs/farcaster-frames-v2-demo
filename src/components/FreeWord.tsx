import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
//import { Context } from '@farcaster/frame-core';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
} from "wagmi";
import { useRouter } from 'next/navigation';
import { encodeFunctionData } from 'viem';
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
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

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

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: contractAddress,
        data: encodeFunctionData({
          abi: wordsAbi,
          functionName: "freeWord",
          args: [inputText]
        }),
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction, inputText]);
  
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

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Free Word</h1>
      <h3 className="my-2 font-semibold text-xs text-center">by jvaleska</h3>

      <div>
        <h2 className="font-2xl font-bold mb-4">Wallet</h2>

        {address && (
          <div className="my-2 text-xs">
            Address: <pre className="inline">{truncateAddress(address)}</pre>
          </div>
        )}

        <div className="mb-4">
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

        {isConnected && (
          <>
            <div className="mb-4">
              <Label>
                Just write something...
              </Label>
              <Input maxLength={32} onChange={(e) => onInputChange(e.target.value)} />
              {inputText &&
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  {inputText}
                </pre>
              </div>}
            </div>
          
            <div className="mb-4">
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSendTxPending}
                isLoading={isSendTxPending}
              >
                Send
              </Button>
              {isSendTxError && renderError(sendTxError)}
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
              <Button onClick={openUrl}>Block Explorer</Button>
            </div>
          </>
        )}
      </div>
              
      <div className="mb-4">
        <Button onClick={backToHome}>Back</Button>
      </div>
    </div>
  );
}
