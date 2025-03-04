"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contracts";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export interface DecreaseUnitsParams {
  poolId: number;
}

export function useDecreaseUnits() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contract write hook
  const {
    data: hash,
    writeContract,
    isPending,
    isError,
    error,
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const decreaseUnits = async (params: DecreaseUnitsParams) => {
    setIsSubmitting(true);

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "decreasePoolUnits",
        args: [BigInt(params.poolId)],
      });

      // Show toast for pending transaction
      toast({
        title: "Decreasing units...",
        description: "Your transaction is being processed.",
      });

      return true;
    } catch (err) {
      console.error("Error decreasing units:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decrease units. Please try again.",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    decreaseUnits,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    hash,
  };
}
