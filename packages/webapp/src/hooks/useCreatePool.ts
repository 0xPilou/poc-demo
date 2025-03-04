"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contracts";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export interface CreatePoolParams {
  poolName: string;
  poolSymbol: string;
}

export function useCreatePool() {
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

  const createPool = async (params: CreatePoolParams) => {
    setIsSubmitting(true);

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "createPool",
        args: [params.poolName, params.poolSymbol],
      });

      // Show toast for pending transaction
      toast({
        title: "Creating pool...",
        description: "Your transaction is being processed.",
      });

      return true;
    } catch (err) {
      console.error("Error creating pool:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create pool. Please try again.",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    createPool,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    hash,
  };
}
