import { useEffect, useCallback, useState } from "react";
import sdk, { FrameNotificationDetails, SignIn } from "@farcaster/frame-sdk";
import { Context } from '@farcaster/frame-core';
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId
} from "wagmi";
import { base, optimism } from "wagmi/chains";
import { useRouter } from 'next/navigation';
import { config } from "~/components/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { AddFrameButton } from "~/components/AddFrame";
//import { RemoveFrameButton } from "~/components/RemoveFrame";
import { RemindButton } from "~/components/RemindButton";
import { ViewProfile } from "~/components/ViewProfile";
import { SIWF } from "~/components/SignInWithFarcaster";
import { SendEth } from "~/components/SendEth";
import { truncateAddress } from "~/lib/truncateAddress";

export default function Demo() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [frameAdded, setFrameAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [lastEvent, setLastEvent] = useState("");
  const [sendNotificationResult, setSendNotificationResult] = useState("");

  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
    setFrameAdded(context?.client.added ?? false);
  }, [context]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`, // `
    });

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
      setContext(await sdk.context);
      
      sdk.on("frameAdded", ({ notificationDetails }) => {
        setLastEvent(
          `frameAdded${!!notificationDetails ? ", notifications enabled" : ""}`
        );

        setFrameAdded(true);
        if (notificationDetails) {
          setNotificationDetails(notificationDetails);
        }
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        setLastEvent(`frameAddRejected, reason ${reason}`);
      });

      sdk.on("frameRemoved", () => {
        setLastEvent("frameRemoved");
        setFrameAdded(false);
        setNotificationDetails(null);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        setLastEvent("notificationsEnabled");
        setNotificationDetails(notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        setLastEvent("notificationsDisabled");
        setNotificationDetails(null);
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });
      
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }, []);
  
  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/Demo.tsx");
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
        data: "0x9846cd9efc000023c0",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

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
  
  const sendNotification = useCallback(async () => {
      setSendNotificationResult("");
      if (!context?.user?.fid) {
        return;
      }

      try {
        const response = await fetch("/api/notis/send-notification", {
          method: "POST",
          mode: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fid: context.user.fid
          }),
        });

        if (response.status === 200) {
          setSendNotificationResult("Success");
          return;
        } else if (response.status === 429) {
          setSendNotificationResult("Rate limited");
          return;
        }

        const data = await response.text();
        setSendNotificationResult(`Error: ${data}`);
      } catch (error) {
        setSendNotificationResult(`Error: ${error}`);
      }
    }, [context]);
    
  const handleSwitchChain = useCallback(() => {
    switchChain({ chainId: chainId === base.id ? optimism.id : base.id });
  }, [switchChain, chainId]);
  
  const siwf = async (nonce: string): Promise<SignIn.SignInResult> => {
    return await sdk.actions.signIn({ nonce });
  }

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);
  
  const backToHome = () => {
    router.push("/");
  }
  
  const openProfile = async () => {
    await sdk.actions.viewProfile({ fid: context?.user?.fid ?? 3 });
  }

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Farcaster Frames v2 Demo</h1>

      <div className="mb-4">
        <h2 className="font-2xl font-bold mb-2">Context</h2>
        <button
          onClick={toggleContext}
          className="flex items-center gap-2 transition-colors"
        >
          <span
            className={`transform transition-transform ${
              isContextOpen ? "rotate-90" : ""
            }`}
          >
            ➤
          </span>
          Tap to expand
        </button>

        {isContextOpen && (
          <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              {JSON.stringify(context, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="font-2xl font-bold">Social</h2>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              {`sdk.actions.viewProfile({ fid })`}
            </pre>
          </div>
          <Button onClick={openProfile}>View Your Profile</Button>
        </div>
        
        <div className="mb-4">
          <ViewProfile />
        </div>        
      </div>

      <div>
        <h2 className="font-2xl font-bold">Actions</h2>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              sdk.actions.addFrame
            </pre>
          </div>
          <div className="mb-2 text-sm">
            Frame added: {frameAdded?.toString()}
          </div>
          <AddFrameButton />
        </div>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              sdk.actions.openUrl
            </pre>
          </div>
          <Button onClick={openUrl}>Open Link</Button>
        </div>
        
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              sdk.actions.openUrl
            </pre>
          </div>
          <Button onClick={openWarpcastUrl}>Open Warpcast Link</Button>
        </div>
        
        <div className="mb-4">
         <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              router.push(&quot;/&quot;)
            </pre>
          </div>
          <Button onClick={backToHome}>Back</Button>
        </div>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              sdk.actions.close
            </pre>
          </div>
          <Button onClick={close}>Close Frame</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="font-2xl font-bold">Auth</h2>
        <SIWF siwf={siwf} />
      </div>
      
      <div className="mb-4">
        <h2 className="font-2xl font-bold">Last event</h2>

        <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            {lastEvent || "No event found"}
          </pre>
        </div>
      </div>
      
      <div>
        <h2 className="font-2xl font-bold">Notifications</h2>

        <div className="mt-2 mb-4 text-sm">
          {frameAdded ? "Frame added," : "Frame not added,"}
          {notificationDetails
            ? " notifications enabled"
            : " notifications disabled"}
        </div>

        {sendNotificationResult && (
          <div className="mb-2 text-sm">
            Send notification result: {sendNotificationResult}
          </div>
        )}   
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              Send a notification instantly.
            </pre>
          </div>
          <Button onClick={sendNotification} disabled={!frameAdded}>
            Send notification
          </Button>
        </div>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              Set a reminder after 1 hour.
            </pre>
          </div>
          <RemindButton fid={context?.user?.fid} timeLeft={3600} />
        </div>
        
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              Set a daily reminder.
            </pre>
          </div>
          <RemindButton fid={context?.user?.fid} isDaily={true} />
        </div>
      </div>

      <div>
        <h2 className="font-2xl font-bold">Wallet</h2>

        <div className="flex flex-row justify-between w-full">
          {address && (
            <div className="my-2 text-xs">
              Address: <pre className="inline">{truncateAddress(address)}</pre>
            </div>
          )}
          
          {chainId && (
            <div className="my-2 text-xs">
              Chain ID: <pre className="inline">{chainId}</pre>
            </div>
          )}
        </div>

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
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  Tip the dev.
                </pre>
              </div>              
              <SendEth />
            </div>
            <div className="mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                  Yoink.
                </pre>
              </div> 
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSendTxPending || chainId !== base.id}
                isLoading={isSendTxPending}
              >
                Send Contract Transaction
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
              <Button
                onClick={handleSwitchChain}
                disabled={!isConnected || isSwitchChainPending}
                isLoading={isSwitchChainPending}
              >
                Switch to {chainId === base.id ? "Optimism" : "Base"}
              </Button>
              {isSwitchChainError && renderError(switchChainError)}
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
