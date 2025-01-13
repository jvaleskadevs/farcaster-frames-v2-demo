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

  const openIntroduction = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/");
  }, []);
  
  const openGettingStarted = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/getting-started");
  }, []); 
  
  const openSpecification = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/spec");
  }, []); 
  
  const openResources = useCallback(() => {
    sdk.actions.openUrl("https://docs.farcaster.xyz/developers/frames/v2/resources");
  }, []);
  
  const openDeveloperTools = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/developers/frames");
  }, []); 
  
  const backToHome = () => {
    router.push("/");
  }
  
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>
      
      <div>
        <h2 className="font-2xl font-bold mb-4">Docs</h2>

        <div className="mb-4">
          <Button onClick={openIntroduction}>Introduction</Button>
        </div>
        
        <div className="mb-4">
          <Button onClick={openGettingStarted}>Getting Started</Button>
        </div>
        
        <div className="mb-4">
          <Button onClick={openSpecification}>Specification</Button>
        </div>
        
        <div className="mb-4">
          <Button onClick={openResources}>Resources</Button>
        </div>
        
        <div className="mb-8">
          <Button onClick={openDeveloperTools}>Developer Tools</Button>
        </div>
        
        <div className="mb-4">
          <Button onClick={backToHome}>Back</Button>
        </div>

      </div>    
    </div>
  );    
}
