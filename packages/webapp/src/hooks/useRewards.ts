"use client";

import { useState } from "react";
import { useContract } from "./useContract";
import { usePools } from "@/context/PoolContext";
import { Pool } from "@/lib/types";

export function useRewards() {
  const { pools, refreshPools } = usePools();
  const contract = useContract();
  const [isCollecting, setIsCollecting] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  // Collect units from a pool
  const collectUnits = async (poolId: string) => {
    setIsCollecting(true);
    try {
      const hash = await contract.collectUnits(poolId);

      // Refresh pools after collecting units
      await refreshPools();

      return hash;
    } catch (error) {
      console.error("Error collecting units:", error);
      throw error;
    } finally {
      setIsCollecting(false);
    }
  };

  // Decrease units from a pool
  const decreaseUnits = async (poolId: string) => {
    setIsDecreasing(true);
    try {
      const hash = await contract.decreaseUnits(poolId);

      // Refresh pools after decreasing units
      await refreshPools();

      return hash;
    } catch (error) {
      console.error("Error decreasing units:", error);
      throw error;
    } finally {
      setIsDecreasing(false);
    }
  };

  // Calculate estimated rewards for a pool
  const calculateEstimatedRewards = (pool: Pool): string => {
    if (
      !pool.userUnits ||
      !pool.totalUnits ||
      parseFloat(pool.totalUnits) === 0
    ) {
      return "0";
    }

    const userUnits = parseFloat(pool.userUnits);
    const totalUnits = parseFloat(pool.totalUnits);
    const flowRate = parseFloat(pool.flowRate);

    // Calculate user's share of the flow rate
    const userShare = userUnits / totalUnits;
    const estimatedRewards = userShare * flowRate;

    return estimatedRewards.toFixed(8);
  };

  return {
    pools,
    isCollecting,
    isDecreasing,
    selectedPool,
    setSelectedPool,
    collectUnits,
    decreaseUnits,
    calculateEstimatedRewards,
  };
}
