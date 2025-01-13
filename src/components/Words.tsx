import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
//import { Context } from '@farcaster/frame-core';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/Button";

export default function Words() {
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
  
  
  const backToHome = () => {
    router.push("/");
  }

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Words</h1>
      <h3 className="font-semibold text-xs text-center mb-4">by jvaleska</h3>

      <div>
        <h2 className="font-2xl font-bold mb-4">Choose a Word</h2>

        <Button
          onClick={() => router.push("/words/freeword")}
          className="mb-4"
        >
          Free Word
        </Button>
        
        <Button
          onClick={() => router.push("/words/goldenword")}
          className="mb-8"
        >
          Golden Word
        </Button>
        
        <Button
          onClick={backToHome}
          className="mb-4"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
