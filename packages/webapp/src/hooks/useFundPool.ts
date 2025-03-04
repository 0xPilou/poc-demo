"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contracts";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export interface AirdropParams {
  poolId: number;
  amount: string;
}

export interface StreamParams {
  poolId: number;
  totalAmount: string;
  duration: string;
}

export function useFundPool() {
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

  const airdropDistribution = async (params: AirdropParams) => {
    setIsSubmitting(true);

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "airdropDistribution",
        args: [BigInt(params.poolId), BigInt(params.amount)],
      });

      // Show toast for pending transaction
      toast({
        title: "Funding pool...",
        description: "Your transaction is being processed.",
      });

      return true;
    } catch (err) {
      console.error("Error funding pool:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fund pool. Please try again.",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  const startDistribution = async (params: StreamParams) => {
    setIsSubmitting(true);

    try {
      // Convert to BigInt
      const amount = BigInt(parseFloat(params.totalAmount) * 1e18);
      const duration = BigInt(params.duration);

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "streamDistribution",
        args: [BigInt(params.poolId), amount, duration],
      });

      // Show toast for pending transaction
      toast({
        title: "Starting distribution...",
        description: "Your transaction is being processed.",
      });

      return true;
    } catch (err) {
      console.error("Error starting distribution:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start distribution. Please try again.",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    airdropDistribution,
    startDistribution,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    hash,
  };
}
