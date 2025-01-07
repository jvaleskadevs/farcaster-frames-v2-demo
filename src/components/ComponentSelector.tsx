import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";

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
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>

      <div className="mb-4">
        <h2 className="font-2xl font-bold">Demo</h2>
        <button
          onClick={() => router.push("/demo")}
          className="flex items-center gap-2 transition-colors"
        >
          Demo
        </button>
      </div>
    </div>
  );
}
