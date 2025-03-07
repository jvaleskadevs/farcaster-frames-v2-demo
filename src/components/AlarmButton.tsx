"use client";

import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { EventFrameAdded } from '@farcaster/frame-core';
import { useNotificationToken } from "../hooks/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "~/components/ui/Button";

export function AlarmButton({ text, timeLeft, isDaily, fid }: { text?: string, timeLeft?: number, isDaily?: boolean, fid?: number }) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [hasSetReminder, setHasSetReminder] = useState(false);

  const queryClient = useQueryClient();
  const { data/*, isLoading*/ } = useNotificationToken({ app: "words", fid: fid });

  const handleRemind = useCallback(async () => {
    if (status === "loading") return;

    if (hasSetReminder) {
      setHasSetReminder(false);
      await sdk.actions.close();
      return;
    }

    try {
      setStatus("loading");
      if (!data.hasToken) {
        const result = await sdk.actions.addFrame() as EventFrameAdded;

        if (result.event === "frame_added") {
          if (result.notificationDetails) {
            await fetch("/api/notis/set-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                app: "words",
                fid: fid,
                token: result.notificationDetails.token,
              })
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ["notification-token"] });
        } else {
          toast.error("Failed to add the frame");
          setStatus("idle");
          return;
        }
      }
      
      if (isDaily) {
        await fetch("/api/alarm/schedule-daily-alarm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fid
          })
        });        
      } else {
        await fetch("/api/alarm/schedule-alarm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fid,
            text,
            timeLeft
          })
        });      
      }      

      toast.success("Reminder has been registered!");
      setHasSetReminder(true);

      setStatus("idle");

    } catch (error) {
      console.log(error);
      toast.error("Failed to schedule reminder");
      setStatus("idle");
    }
  }, [timeLeft, status, hasSetReminder, data?.hasToken, queryClient, fid, isDaily, text]);

  return (
    <div className="mt-4 w-full mb-8">
      <Button
        onClick={handleRemind}
        disabled={status === "loading" || !fid}
        isLoading={status === "loading"}
      >
        {status === "loading"
          ? "Setting alarm..."
          : hasSetReminder
            ? "Done"
            : "Remind me"}
      </Button>
    </div>
  );
}
