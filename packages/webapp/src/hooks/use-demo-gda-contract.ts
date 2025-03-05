import { useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { DEMO_GDA_ABI, DEMO_GDA_ADDRESS } from "@/config/contracts";

export function useDemoGDAContract() {
  const { address } = useAccount();

  // Create a new pool
  const {
    data: createPoolHash,
    isPending: isCreatePoolLoading,
    isSuccess: isCreatePoolSuccess,
    writeContract: writeCreatePool,
  } = useWriteContract();

  const { isLoading: isCreatePoolTxLoading, isSuccess: isCreatePoolTxSuccess } =
    useWaitForTransactionReceipt({
      hash: createPoolHash,
    });

  // Airdrop distribution to a pool
  const {
    data: airdropHash,
    isPending: isAirdropLoading,
    isSuccess: isAirdropSuccess,
    writeContract: writeAirdropDistribution,
  } = useWriteContract();

  const { isLoading: isAirdropTxLoading, isSuccess: isAirdropTxSuccess } =
    useWaitForTransactionReceipt({
      hash: airdropHash,
    });

  // Start a streaming distribution to a pool
  const {
    data: streamDistributionHash,
    isPending: isStreamDistributionLoading,
    isSuccess: isStreamDistributionSuccess,
    writeContract: writeStreamDistribution,
  } = useWriteContract();

  const {
    isLoading: isStreamDistributionTxLoading,
    isSuccess: isStreamDistributionTxSuccess,
  } = useWaitForTransactionReceipt({
    hash: streamDistributionHash,
  });

  // Increase units from a pool
  const {
    data: increaseUnitsHash,
    isPending: isIncreaseUnitsLoading,
    isSuccess: isIncreaseUnitsSuccess,
    writeContract: writeIncreaseUnits,
  } = useWriteContract();

  const {
    isLoading: isIncreaseUnitsTxLoading,
    isSuccess: isIncreaseUnitsTxSuccess,
  } = useWaitForTransactionReceipt({
    hash: increaseUnitsHash,
  });

  // Decrease units from a pool
  const {
    data: decreaseUnitsHash,
    isPending: isDecreaseUnitsLoading,
    isSuccess: isDecreaseUnitsSuccess,
    writeContract: writeDecreaseUnits,
  } = useWriteContract();

  const {
    isLoading: isDecreaseUnitsTxLoading,
    isSuccess: isDecreaseUnitsTxSuccess,
  } = useWaitForTransactionReceipt({
    hash: decreaseUnitsHash,
  });

  // Get pool count
  const { data: poolCount, isLoading: isPoolCountLoading } = useReadContract({
    address: DEMO_GDA_ADDRESS,
    abi: DEMO_GDA_ABI,
    functionName: "poolCount",
  });

  // Mock implementation for getAllPools
  const allPools = ["1", "2", "3"];
  const isAllPoolsLoading = false;
  const refetchAllPools = () => {};

  // Mock implementation for getUserPools
  const userPools = ["1", "2"];
  const isUserPoolsLoading = false;
  const refetchUserPools = () => {};

  // Wrapper functions with proper args handling
  const createPool = useCallback(
    (name: string, symbol: string) => {
      writeCreatePool({
        address: DEMO_GDA_ADDRESS,
        abi: DEMO_GDA_ABI,
        functionName: "createPool",
        args: [name, symbol],
      });
    },
    [writeCreatePool]
  );

  const airdropDistribution = useCallback(
    (poolId: string, amount: string) => {
      writeAirdropDistribution({
        address: DEMO_GDA_ADDRESS,
        abi: DEMO_GDA_ABI,
        functionName: "airdropDistribution",
        args: [BigInt(poolId), parseEther(amount)],
      });
    },
    [writeAirdropDistribution]
  );

  const startDistribution = useCallback(
    (poolId: string, flowRate: string, duration: string) => {
      writeStreamDistribution({
        address: DEMO_GDA_ADDRESS,
        abi: DEMO_GDA_ABI,
        functionName: "streamDistribution",
        args: [BigInt(poolId), parseEther(flowRate), BigInt(duration)],
      });
    },
    [writeStreamDistribution]
  );

  const increaseUnits = useCallback(
    (poolId: string) => {
      writeIncreaseUnits({
        address: DEMO_GDA_ADDRESS,
        abi: DEMO_GDA_ABI,
        functionName: "increasePoolUnits",
        args: [BigInt(poolId)],
      });
    },
    [writeIncreaseUnits]
  );

  const decreaseUnits = useCallback(
    (poolId: string) => {
      writeDecreaseUnits({
        address: DEMO_GDA_ADDRESS,
        abi: DEMO_GDA_ABI,
        functionName: "decreasePoolUnits",
        args: [BigInt(poolId)],
      });
    },
    [writeDecreaseUnits]
  );

  // Get pool details - mock implementation
  const getPoolDetails = useCallback((poolId: string) => {
    return {
      data: {
        id: poolId,
        name: `Pool ${poolId}`,
        symbol: `P${poolId}`,
        flowRate: String(Number(poolId) * 10),
        totalUnits: String(Number(poolId) * 100),
        rewardToken: "SUPER",
      },
      isLoading: false,
    };
  }, []);

  // Get user units in a pool - mock implementation
  const getUserUnits = useCallback((poolId: string, userAddress: string) => {
    return {
      data: Math.floor(Math.random() * 50),
      isLoading: false,
    };
  }, []);

  return {
    // Create pool
    createPool,
    isCreatePoolLoading: isCreatePoolLoading || isCreatePoolTxLoading,
    isCreatePoolSuccess: isCreatePoolSuccess && isCreatePoolTxSuccess,

    // Airdrop distribution
    airdropDistribution,
    isAirdropLoading: isAirdropLoading || isAirdropTxLoading,
    isAirdropSuccess: isAirdropSuccess && isAirdropTxSuccess,

    // Start distribution
    startDistribution,
    isStartDistributionLoading:
      isStreamDistributionLoading || isStreamDistributionTxLoading,
    isStartDistributionSuccess:
      isStreamDistributionSuccess && isStreamDistributionTxSuccess,

    // Increase units
    increaseUnits,
    isIncreaseUnitsLoading: isIncreaseUnitsLoading || isIncreaseUnitsTxLoading,
    isIncreaseUnitsSuccess: isIncreaseUnitsSuccess && isIncreaseUnitsTxSuccess,

    // Decrease units
    decreaseUnits,
    isDecreaseUnitsLoading: isDecreaseUnitsLoading || isDecreaseUnitsTxLoading,
    isDecreaseUnitsSuccess: isDecreaseUnitsSuccess && isDecreaseUnitsTxSuccess,

    // Read functions
    poolCount,
    isPoolCountLoading,

    allPools,
    isAllPoolsLoading,
    refetchAllPools,

    userPools,
    isUserPoolsLoading,
    refetchUserPools,

    getPoolDetails,
    getUserUnits,
  };
}
