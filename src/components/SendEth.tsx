import { useCallback, useMemo } from "react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { base } from "viem/chains";
import { Address } from "viem";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";


export function SendEth() {
  const { isConnected, chainId } = useAccount();
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const toAddr = useMemo(() => {
    return chainId === base.id
      ? "0x26281BB0b775A59Db0538b555f161E8F364fd21e" as Address
      : "0x26281BB0b775A59Db0538b555f161E8F364fd21e" as Address;
  }, [chainId]);

  const handleSend = useCallback(() => {
    sendTransaction({
      to: toAddr,
      value: BigInt(1),
    });
  }, [toAddr, sendTransaction]);
  
  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  return (
    <>
      <Button
        onClick={handleSend}
        disabled={!isConnected || isSendTxPending}
        isLoading={isSendTxPending}
      >
        Send Eth Transaction
      </Button>
      {isSendTxError && renderError(sendTxError)}
      {data && (
        <div className="mt-2 text-xs">
          <div>Hash: {truncateAddress(data)}</div>
          <div>
            Status:{" "}
            {isConfirming
              ? "Confirming..."
              : isConfirmed
              ? "Confirmed!"
              : "Pending"}
          </div>
        </div>
      )}
    </>
  );
}
