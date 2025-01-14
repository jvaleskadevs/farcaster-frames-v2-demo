import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { Context } from '@farcaster/frame-core';
import { useRouter } from 'next/navigation';
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/Button";
import { AlarmButton } from "~/components/AlarmButton";

export default function Alarm() {
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const [inputDate, setInputDate] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/Alarm.tsx");
  }, []); 
  
  const backToHome = () => {
    router.push("/");
  }
  
  const onInputTextChange = (value: string) => {
    setInputText(value);
  }

  const onInputDateChange = (value: string | number | Date) => {
    setInputDate(formatDate(value));
  }
  
  const formatDate = (date: string | number | Date): number | undefined => {
    try {
      return (Math.floor(new Date(date).getTime() - Date.now()) / 1000);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-2">Alarm</h1>
      <h3 className="font-semibold text-xs text-center mb-4">by jvaleska</h3>
      
      <div className="mb-4">
        <Label>
          Write yourself a reminder
        </Label>
        <Input maxLength={32} onChange={(e) => onInputTextChange(e.target.value)} />
        {inputText &&
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            {inputText}
          </pre>
        </div>}
      </div> 
      
      <div className="mb-4">
        <Label>
          Select when to be notified
        </Label>
        <Input type="datetime-local" min={Date.now()} onChange={(e) => onInputDateChange(e.target.value)} className="dark:bg-white" />
        {inputDate &&
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            {inputDate}
          </pre>
        </div>}
      </div> 
      
      <AlarmButton
        text={inputText}
        fid={context?.user?.fid}
        timeLeft={inputDate}
      />     
      
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
