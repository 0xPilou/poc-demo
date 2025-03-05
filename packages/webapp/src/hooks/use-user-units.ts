import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useDemoGDAContract } from "./use-demo-gda-contract";
import { useToast } from "./use-toast";

export function useUserUnits(poolId: string) {
  const { address } = useAccount();
  const {
    collectUnits,
    decreaseUnits,
    isCollectUnitsLoading,
    isDecreaseUnitsLoading,
    isCollectUnitsSuccess,
    isDecreaseUnitsSuccess,
    getUserUnits,
  } = useDemoGDAContract();
  const { toast } = useToast();

  const [units, setUnits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch user units for the specified pool
  const fetchUserUnits = useCallback(async () => {
    if (!address || !poolId) return;

    setLoading(true);

    try {
      // In a real implementation, we would call getUserUnits and get the result
      // For now, we'll use mock data
      const mockUnits = Math.floor(Math.random() * 100);
      setUnits(mockUnits);
    } catch (error) {
      console.error("Error fetching user units:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your units for this pool.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [address, poolId, getUserUnits, toast]);

  // Handle collecting units
  const handleCollectUnits = useCallback(
    async (amount: string) => {
      if (!address || !poolId) return;

      try {
        collectUnits(poolId, amount);
      } catch (error) {
        console.error("Error collecting units:", error);
        toast({
          title: "Error",
          description: "Failed to collect units from this pool.",
          variant: "destructive",
        });
      }
    },
    [address, poolId, collectUnits, toast]
  );

  // Handle decreasing units
  const handleDecreaseUnits = useCallback(
    async (amount: string) => {
      if (!address || !poolId) return;

      try {
        decreaseUnits(poolId, amount);
      } catch (error) {
        console.error("Error decreasing units:", error);
        toast({
          title: "Error",
          description: "Failed to decrease units from this pool.",
          variant: "destructive",
        });
      }
    },
    [address, poolId, decreaseUnits, toast]
  );

  // Fetch user units when dependencies change
  useEffect(() => {
    fetchUserUnits();
  }, [fetchUserUnits]);

  // Show success toast when collect units is successful
  useEffect(() => {
    if (isCollectUnitsSuccess) {
      toast({
        title: "Success",
        description: "Successfully collected units from the pool.",
      });
      fetchUserUnits();
    }
  }, [isCollectUnitsSuccess, fetchUserUnits, toast]);

  // Show success toast when decrease units is successful
  useEffect(() => {
    if (isDecreaseUnitsSuccess) {
      toast({
        title: "Success",
        description: "Successfully decreased units from the pool.",
      });
      fetchUserUnits();
    }
  }, [isDecreaseUnitsSuccess, fetchUserUnits, toast]);

  return {
    units,
    loading: loading || isCollectUnitsLoading || isDecreaseUnitsLoading,
    collectUnits: handleCollectUnits,
    decreaseUnits: handleDecreaseUnits,
    refreshUnits: fetchUserUnits,
  };
}
