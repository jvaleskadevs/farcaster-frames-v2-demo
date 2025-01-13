"use client";

import { useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { EventFrameAdded } from '@farcaster/frame-core';
import { useNotificationToken } from "../hooks/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "~/components/ui/Button";

export function RemindButton({ timeLeft, fid }: { timeLeft: number, fid?: number }) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [hasSetReminder, setHasSetReminder] = useState(false);

  const queryClient = useQueryClient();
  const { data/*, isLoading*/ } = useNotificationToken({ app: "words", fid: fid });

  const handleRemind = useCallback(async () => {
    if (status === "loading") return;

    if (hasSetReminder) {
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
              }),
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ["notification-token"] }); // (!)
        }/* else if (result.reason === "rejected_by_user") {
          toast.error("You dismissed the frame request");
          setStatus("idle");
        }*/      
      }
      
      await fetch("/api/notis/schedule-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid: fid,
          timeLeft,
        }),
      });

      toast.success(`We'll remind you after ${timeLeft} seconds!`);
      setHasSetReminder(true);

      setStatus("idle");

    } catch (error) {
      console.log(error);
      toast.error("Failed to schedule reminder");
      setStatus("idle");
    }
  }, [timeLeft, status, hasSetReminder, data?.hasToken, queryClient, fid]);

  return (
    <div className="mt-4 w-full">
      <Button
        onClick={handleRemind}
        disabled={status === "loading" || !fid}
        isLoading={status === "loading"}
      >
        {status === "loading"
          ? "Setting reminder..."
          : hasSetReminder
            ? "Close"
            : "Remind me"}
      </Button>
    </div>
  );
}
