import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/Button";

export default function Docs() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openFramesV2Demo = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/getting-started");
  }, []);
  
  const openNotifications = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/notifications_webhooks");
  }, []); 
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/Tutorials.tsx");
  }, []);
  
  const backToHome = () => {
    router.push("/");
  }
  
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Farcaster Frames v2 Demo</h1>
      <h3 className="font-semibold text-xs text-center mb-4">by jvaleska</h3>
      
      <div>
        <h2 className="font-2xl font-bold mb-4">Tutorials</h2>

        <div className="mb-4">
          <Button onClick={openFramesV2Demo}>Frames v2 Demo</Button>
        </div>
        
        <div className="mb-8">
          <Button onClick={openNotifications}>Notifications</Button>
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
    </div>
  );    
}
