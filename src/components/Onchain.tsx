import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
//import { Context } from '@farcaster/frame-core';
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
} from "wagmi";
import { useRouter } from 'next/navigation';
import { encodeFunctionData } from 'viem';
import { config } from "~/components/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { yoinkAbi } from "~/abis/yoinkAbi";
import { truncateAddress } from "~/lib/truncateAddress";

export default function Onchain() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  //const [context, setContext] = useState<Context.FrameContext>();
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const {
    signMessage,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData();

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
  
  const contractAddress = "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878";
  const contractAbi = yoinkAbi;

  const openUrl = useCallback(() => {
    sdk.actions.openUrl(`https://basescan.org/address/${contractAddress}`);
  }, [contractAddress]);
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/Onchain.tsx");
  }, []);
  
  const txData = encodeFunctionData({
    abi: contractAbi,
    functionName: "yoink",
    args: []
  });

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: contractAddress,
        data: txData || "0x9846cd9efc000023c0",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [txData, sendTransaction]);

  const sign = useCallback(() => {
    signMessage({ message: "Hello from Farcaster Frames v2 demo!" });
  }, [signMessage]);

  const signTyped = useCallback(() => {
    signTypedData({
      domain: {
        name: "Farcaster Frames v2 Demo",
        version: "1",
        chainId: 8453,
      },
      types: {
        Message: [{ name: "content", type: "string" }],
      },
      message: {
        content: "Hello from Farcaster Frames v2 demo!",
      },
      primaryType: "Message",
    });
  }, [signTypedData]);
  
  const backToHome = () => {
    router.push("/");
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
      <h1 className="text-2xl font-bold text-center mb-4">Onchain</h1>

      <div>
        <h2 className="font-2xl font-bold mb-4">Wallet</h2>

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

        {isConnected && (
          <>
            <div className="mb-4">
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSendTxPending}
                isLoading={isSendTxPending}
              >
                Yoink
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
              <Button
                onClick={sign}
                disabled={!isConnected || isSignPending}
                isLoading={isSignPending}
              >
                Sign Message
              </Button>
              {isSignError && renderError(signError)}
            </div>
            <div className="mb-4">
              <Button
                onClick={signTyped}
                disabled={!isConnected || isSignTypedPending}
                isLoading={isSignTypedPending}
              >
                Sign Typed Data
              </Button>
              {isSignTypedError && renderError(signTypedError)}
            </div>
            <div className="mb-8">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  { txHash ? "See tx in basescan" : "See yoink contract in basescan" }
                </pre>
              </div> 
              <Button onClick={openUrl}>Block Explorer</Button>
            </div>
          </>
        )}
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
