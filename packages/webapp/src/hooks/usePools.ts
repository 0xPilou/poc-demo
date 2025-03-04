"use client";

import { useEffect, useState } from "react";
import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contracts";
import { Pool } from "@/lib/types";

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { address } = useAccount();

  // Get pool count
  const { data: poolCount, isLoading: isLoadingPoolCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "poolCount",
  });

  // Create contract calls for each pool
  const count = poolCount ? Number(poolCount) : 0;
  const poolCalls = Array.from({ length: count }, (_, i) => ({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "pools",
    args: [BigInt(i)],
  }));

  // Fetch all pools in a single call
  const { data: poolAddresses, isLoading: isLoadingPools } = useReadContracts({
    contracts: poolCalls,
    query: {
      enabled: count > 0,
    },
  });

  // Create contract calls for user units if user is connected
  const userUnitsCalls = address
    ? Array.from({ length: count }, (_, i) => ({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "getUserUnits",
        args: [BigInt(i), address as `0x${string}`],
      }))
    : [];

  // Fetch user units for each pool
  const { data: userUnitsData, isLoading: isLoadingUserUnits } =
    useReadContracts({
      contracts: userUnitsCalls,
      query: {
        enabled: count > 0 && !!address,
      },
    });

  // Process the pool data
  useEffect(() => {
    if (
      isLoadingPoolCount ||
      isLoadingPools ||
      (address && isLoadingUserUnits)
    ) {
      setIsLoading(true);
      return;
    }

    try {
      if (!poolCount || Number(poolCount) === 0 || !poolAddresses) {
        setPools([]);
        setIsLoading(false);
        return;
      }

      // Map the pool addresses to Pool objects
      const poolsData = poolAddresses.map((result, i) => {
        const poolAddress = result.result as string;

        // Get user units for this pool if available
        const userUnits =
          userUnitsData && userUnitsData[i]?.result
            ? String(userUnitsData[i].result)
            : "0";

        return {
          id: i,
          name: `Pool ${i}`, // In a real app, you'd fetch this from the pool contract
          symbol: `P${i}`, // In a real app, you'd fetch this from the pool contract
          address: poolAddress,
          admin: "0x0000000000000000000000000000000000000000", // In a real app, you'd fetch this from the contract
          superToken: CONTRACT_ADDRESS, // Using the contract address as the superToken for simplicity
          tokenSymbol: "TOKEN", // In a real app, you'd fetch this from the token contract
          tokenDecimals: 18, // In a real app, you'd fetch this from the token contract
          flowRate: "0", // In a real app, you'd fetch this from the contract
          totalUnits: "0", // In a real app, you'd fetch this from the contract
          userUnits: userUnits, // User's units in this pool
          createdAt: Date.now(), // In a real app, you'd fetch this from the contract
        };
      });

      setPools(poolsData);
    } catch (err) {
      console.error("Error processing pool data:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to process pool data")
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    poolCount,
    poolAddresses,
    userUnitsData,
    address,
    isLoadingPoolCount,
    isLoadingPools,
    isLoadingUserUnits,
  ]);

  return {
    pools,
    isLoading:
      isLoading ||
      isLoadingPoolCount ||
      isLoadingPools ||
      (address && isLoadingUserUnits),
    error,
    refetch: () => {
      setIsLoading(true);
      // This will trigger the useEffect to run again
    },
  };
}
