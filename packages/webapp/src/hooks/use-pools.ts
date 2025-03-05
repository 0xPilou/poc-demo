import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useDemoGDAContract } from "./use-demo-gda-contract";

interface Pool {
  id: string;
  name: string;
  description: string;
  flowRate: string;
  totalUnits: string;
  userUnits: number;
  rewardToken: string;
}

export function usePools() {
  const { address } = useAccount();
  const {
    allPools,
    userPools,
    isAllPoolsLoading,
    isUserPoolsLoading,
    refetchAllPools,
    refetchUserPools,
    getPoolDetails,
    getUserUnits,
  } = useDemoGDAContract();

  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pool details and user units for each pool
  const fetchPoolDetails = useCallback(async () => {
    if (!allPools || !address) return;

    setLoading(true);

    try {
      const poolIds = Array.isArray(allPools) ? allPools : [];

      // For now, we'll use mock data since we don't have the actual contract implementation
      const mockPoolDetails = poolIds.map((poolId, index) => ({
        id: poolId.toString(),
        name: `Pool ${index + 1}`,
        description: `Description for Pool ${index + 1}`,
        flowRate: ((index + 1) * 10).toString(),
        totalUnits: ((index + 1) * 100).toString(),
        userUnits: Math.floor(Math.random() * 50),
        rewardToken: "SUPER",
      }));

      setPools(mockPoolDetails);
    } catch (error) {
      console.error("Error fetching pool details:", error);
    } finally {
      setLoading(false);
    }
  }, [allPools, address, getPoolDetails, getUserUnits]);

  // Fetch user's created pools
  const fetchUserPools = useCallback(async () => {
    if (!userPools || !address) return;

    // This would be implemented with actual contract calls
    // For now, we'll just log that we would fetch user pools
    console.log("Would fetch user pools:", userPools);

    // Refresh all pools to ensure we have the latest data
    refetchAllPools();
  }, [userPools, address, refetchAllPools]);

  // Fetch all data when dependencies change
  useEffect(() => {
    fetchPoolDetails();
  }, [fetchPoolDetails]);

  useEffect(() => {
    fetchUserPools();
  }, [fetchUserPools]);

  // Refresh all data
  const refreshPools = useCallback(() => {
    refetchAllPools();
    refetchUserPools();
  }, [refetchAllPools, refetchUserPools]);

  return {
    pools,
    loading: loading || isAllPoolsLoading || isUserPoolsLoading,
    refreshPools,
  };
}
