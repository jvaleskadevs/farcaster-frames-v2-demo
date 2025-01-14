import { useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/Button";

export function ViewProfile() {
  const [fid, setFid] = useState('3');

  return (
    <>
      <div>
        <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="view-profile-fid">Fid</Label>
        <Input
          id="view-profile-fid"
          type="number"
          value={fid}
          className="mb-2"
          onChange={(e) => { 
            setFid(e.target.value)
          }}
          step="1"
          min="1"
        />
      </div>
      <Button
        onClick={() => { sdk.actions.viewProfile({ fid: parseInt(fid) }) }}
      >
        View Profile
      </Button>
    </>
  );
}
