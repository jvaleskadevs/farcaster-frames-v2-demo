import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Custom v2 Demo</h1>
      <h3 className="font-semibold text-xs text-center mb-4">by jvaleska</h3>

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
      
    </div>
  );
}
