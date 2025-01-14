import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "~/components/ui/Button";

export default function ComponentSelector() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  //const [context, setContext] = useState<Context.FrameContext>();
  
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
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/ComponentSelector.tsx");
  }, []); 
  
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Farcaster Frames v2 Demo</h1>

      <div className="mb-4">
        <h2 className="font-2xl font-bold mb-4">Menu</h2>
        <Button
          onClick={() => router.push("/demo")}
        >
          Demo
        </Button>
      </div>
      
      <div className="mb-4">
        <Button
          onClick={() => router.push("/onchain")}
        >
          Onchain 
        </Button>
      </div>   
      
      <div className="mb-4">
        <Button
          onClick={() => router.push("/alarm")}
        >
          Alaaarma! 
        </Button>
      </div> 
      
      <div className="mb-4">
        <Button
          onClick={() => router.push("/words")}
        >
          Words 
        </Button>
      </div>  

      <div className="mb-4">
        <Button
          onClick={() => router.push("/yoink")}
        >
          Yoink 
        </Button>
      </div>  
      
      <div className="mb-4">
        <Button
          onClick={() => router.push("/docs")}
        >
          Docs 
        </Button>
      </div>
      
      <div className="mb-4">
        <Button
          onClick={() => router.push("/tutorials")}
        >
          Tutorials 
        </Button>
      </div>
      


      <div className="mb-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            Open this component in github
          </pre>
        </div>
        <Button onClick={openGithub}>View Code</Button>
      </div>
      
    </div>
  );
}
