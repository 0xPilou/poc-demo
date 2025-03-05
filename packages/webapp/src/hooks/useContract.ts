"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Pool } from "@/lib/types";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contracts";

// This is a placeholder - in a real implementation, you would import the actual ABI and contract addresses
const DEMO_GDA_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "superToken", type: "address" },
    ],
    name: "createPool",
    outputs: [{ name: "poolAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "poolAddress", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "airdropDistribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "poolAddress", type: "address" },
      { name: "flowRate", type: "int96" },
    ],
    name: "startDistribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "poolAddress", type: "address" },
      { name: "units", type: "uint256" },
    ],
    name: "collectUnits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "poolAddress", type: "address" },
      { name: "units", type: "uint256" },
    ],
    name: "decreaseUnits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function useContract() {
  const { address } = useAccount();
  const { writeContractAsync, isPending, isError, isSuccess } =
    useWriteContract();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Create a new pool
  const createPool = async (name: string, symbol: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "createPool",
        args: [name, symbol], // Contract expects poolName, poolSymbol
      });

      setTransactionHash(hash);
      return hash;
    } catch (error) {
      console.error("Error creating pool:", error);
      throw error;
    }
  };

  // Fund a pool with a one-time payment
  const airdropDistribution = async (poolId: string, amount: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "airdropDistribution",
        args: [BigInt(poolId), parseEther(amount)],
      });

      setTransactionHash(hash);
      return hash;
    } catch (error) {
      console.error("Error funding pool:", error);
      throw error;
    }
  };

  // Fund a pool with a streamed payment
  const startDistribution = async (
    poolId: string,
    flowRate: string,
    duration: string
  ) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "streamDistribution",
        args: [BigInt(poolId), parseEther(flowRate), BigInt(duration)],
      });

      setTransactionHash(hash);
      return hash;
    } catch (error) {
      console.error("Error starting distribution:", error);
      throw error;
    }
  };

  // Collect units from a pool
  const collectUnits = async (poolId: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "increasePoolUnits",
        args: [BigInt(poolId)],
      });

      setTransactionHash(hash);
      return hash;
    } catch (error) {
      console.error("Error collecting units:", error);
      throw error;
    }
  };

  // Decrease units from a pool
  const decreaseUnits = async (poolId: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "decreasePoolUnits",
        args: [BigInt(poolId)],
      });

      setTransactionHash(hash);
      return hash;
    } catch (error) {
      console.error("Error decreasing units:", error);
      throw error;
    }
  };

  return {
    createPool,
    airdropDistribution,
    startDistribution,
    collectUnits,
    decreaseUnits,
    isPending,
    isError,
    isSuccess,
    transactionHash,
  };
}
