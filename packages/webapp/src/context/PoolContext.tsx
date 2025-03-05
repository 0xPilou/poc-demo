"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Pool, Distribution } from "@/lib/types";
import { useAccount } from "wagmi";

interface PoolContextType {
  pools: Pool[];
  userPools: Pool[];
  distributions: Distribution[];
  isLoading: boolean;
  error: Error | null;
  refreshPools: () => Promise<void>;
}

const PoolContext = createContext<PoolContextType | undefined>(undefined);

export function PoolProvider({ children }: { children: ReactNode }) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { address } = useAccount();

  // Filter pools created by the current user
  const userPools = pools.filter(
    (pool) => pool.owner.toLowerCase() === (address?.toLowerCase() || "")
  );

  // Function to fetch pools from the blockchain
  const fetchPools = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This is a placeholder - in a real implementation, you would fetch data from the blockchain
      // For now, we'll just simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for development
      const mockPools: Pool[] = [
        {
          id: "1",
          address: "0x1234567890123456789012345678901234567890",
          name: "Community Pool 1",
          superToken: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          tokenSymbol: "fDAIx",
          totalUnits: "1000",
          userUnits: address ? "100" : "0",
          flowRate: "0.01",
          createdAt: Date.now() - 86400000, // 1 day ago
          owner: "0x9876543210987654321098765432109876543210",
          isActive: true,
        },
        {
          id: "2",
          address: "0x2345678901234567890123456789012345678901",
          name: "Community Pool 2",
          superToken: "0xbcdefabcdefabcdefabcdefabcdefabcdefabcde",
          tokenSymbol: "fUSDCx",
          totalUnits: "500",
          userUnits: address ? "50" : "0",
          flowRate: "0.005",
          createdAt: Date.now() - 172800000, // 2 days ago
          owner: address || "0x9876543210987654321098765432109876543210",
          isActive: true,
        },
      ];

      const mockDistributions: Distribution[] = [
        {
          id: "1",
          poolId: "1",
          amount: "1000",
          flowRate: "0.01",
          startTime: Date.now() - 86400000, // 1 day ago
          isStreaming: true,
        },
        {
          id: "2",
          poolId: "2",
          amount: "500",
          flowRate: "0.005",
          startTime: Date.now() - 172800000, // 2 days ago
          endTime: Date.now() + 172800000, // 2 days from now
          isStreaming: true,
        },
      ];

      setPools(mockPools);
      setDistributions(mockDistributions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pools"));
      console.error("Error fetching pools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pools on component mount and when address changes
  useEffect(() => {
    fetchPools();
  }, [address]);

  return (
    <PoolContext.Provider
      value={{
        pools,
        userPools,
        distributions,
        isLoading,
        error,
        refreshPools: fetchPools,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
}

export function usePools() {
  const context = useContext(PoolContext);
  if (context === undefined) {
    throw new Error("usePools must be used within a PoolProvider");
  }
  return context;
}
