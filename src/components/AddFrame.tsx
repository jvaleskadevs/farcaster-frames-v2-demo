"use client";

import { useCallback, useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { EventFrameAdded } from '@farcaster/frame-core';
import { useNotificationToken } from "../hooks/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { toast } from "react-toastify";

export function AddFrameButton() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fid, setFid] = useState<number>();

  const { data/*, isLoading*/ } = useNotificationToken({ app: "words", fid });

  useEffect(() => {
    const init = async () => {
      const context = await sdk.context;
      setFid(context.user.fid);
    };
    init();
  });

  const handleAddFrame = useCallback(async () => {
    if (status === "loading") return;

    if (status === "success" || data?.hasToken) {
      await sdk.actions.close();
      return;
    }

    try {
      setStatus("loading");
      const result = await sdk.actions.addFrame() as EventFrameAdded;

      if (result.event === "frame_added") {
        if (result.notificationDetails) {
          const context = await sdk.context;

          await fetch("/api/notis/set-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              app: "words",
              fid: context.user.fid,
              token: result.notificationDetails.token,
            }),
          });
          setStatus("success");
          queryClient.invalidateQueries({ queryKey: ["notification-token"] });
          toast.success("Frame added successfully!");
        } else {
          setStatus("success");
        }
      } else {
        setStatus("error");    
        setErrorMessage("Something was wrong.");  
      }
      /*
      else if (result.reason === "rejected_by_user") {
        setStatus("error"); 
        setErrorMessage("You dismissed the frame request");
      } else if (result.reason === "invalid_domain_manifest") {
        setStatus("error");
        setErrorMessage("Invalid frame manifest");
      }
      */
    } catch (error) {
      console.log(error);
      setStatus("error");
      setErrorMessage("Failed to store notification token");
    }
  }, [status, queryClient, data?.hasToken]);

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleAddFrame}
        disabled={status === "loading"}
        isLoading={status === "loading"}
      >
        {status === "loading"
          ? "Adding frame..."
          : status === "success" || data?.hasToken
            ? "Close"
            : "Add Frame"}
      </Button>

      {status === "error" && (
        <div className="text-sm text-red-600 font-medium">{errorMessage}</div>
      )}
    </div>
  );
}
