"use client";

import { useState } from "react";
import { useContract } from "./useContract";
import { usePools as usePoolsContext } from "@/context/PoolContext";
import { useToast } from "@/components/ui/use-toast";

export function usePools() {
  const { pools, userPools, distributions, isLoading, error, refreshPools } =
    usePoolsContext();
  const contract = useContract();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  // Create a new pool
  const createPool = async (name: string, symbol: string) => {
    setIsCreating(true);
    try {
      const hash = await contract.createPool(name, symbol);

      toast({
        title: "Pool created successfully",
        description: `Transaction hash: ${hash}`,
      });

      // Refresh pools after creation
      await refreshPools();

      return hash;
    } catch (error) {
      console.error("Error creating pool:", error);

      toast({
        variant: "destructive",
        title: "Failed to create pool",
        description: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Fund a pool with a one-time payment
  const fundPoolOneTime = async (poolId: string, amount: string) => {
    setIsFunding(true);
    try {
      const hash = await contract.airdropDistribution(poolId, amount);

      toast({
        title: "Pool funded successfully",
        description: `Transaction hash: ${hash}`,
      });

      // Refresh pools after funding
      await refreshPools();

      return hash;
    } catch (error) {
      console.error("Error funding pool:", error);

      toast({
        variant: "destructive",
        title: "Failed to fund pool",
        description: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    } finally {
      setIsFunding(false);
    }
  };

  // Fund a pool with a streamed payment
  const fundPoolStream = async (
    poolId: string,
    flowRate: string,
    duration: string
  ) => {
    setIsFunding(true);
    try {
      const hash = await contract.startDistribution(poolId, flowRate, duration);

      toast({
        title: "Stream started successfully",
        description: `Transaction hash: ${hash}`,
      });

      // Refresh pools after funding
      await refreshPools();

      return hash;
    } catch (error) {
      console.error("Error starting stream:", error);

      toast({
        variant: "destructive",
        title: "Failed to start stream",
        description: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    } finally {
      setIsFunding(false);
    }
  };

  return {
    pools,
    userPools,
    distributions,
    isLoading,
    error,
    isCreating,
    isFunding,
    createPool,
    fundPoolOneTime,
    fundPoolStream,
    refreshPools,
  };
}
