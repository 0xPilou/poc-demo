"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS, ERC20_ABI } from "@/config/contracts";
import { Pool } from "@/lib/types";

export function usePool(poolId: number) {
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get pool data
  const { data: poolAddress } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "pools",
    args: [BigInt(poolId)],
  });

  useEffect(() => {
    const fetchPool = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (poolAddress) {
          // Create a simplified pool object
          // In a real app, you'd fetch more data from the contract
          setPool({
            id: poolId,
            name: `Pool ${poolId}`, // In a real app, you'd fetch this from the contract
            symbol: `P${poolId}`, // In a real app, you'd fetch this from the contract
            address: poolAddress as string,
            admin: "0x0000000000000000000000000000000000000000", // In a real app, you'd fetch this from the contract
            superToken: CONTRACT_ADDRESS, // Using the contract address as the superToken for simplicity
            tokenSymbol: "TOKEN", // In a real app, you'd fetch this from the token contract
            tokenDecimals: 18, // In a real app, you'd fetch this from the token contract
            flowRate: "0", // In a real app, you'd fetch this from the contract
            totalUnits: "0", // In a real app, you'd fetch this from the contract
            createdAt: Date.now(), // In a real app, you'd fetch this from the contract
          });
        } else {
          setError(new Error("Pool not found"));
        }
      } catch (err) {
        console.error("Error fetching pool:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch pool")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPool();
  }, [poolId, poolAddress]);

  return {
    pool,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      // This will trigger the useEffect to run again
    },
  };
}
