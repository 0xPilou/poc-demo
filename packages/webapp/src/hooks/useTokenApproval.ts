"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import {
  SUPERTOKEN_ADDRESS,
  CONTRACT_ADDRESS,
  ERC20_ABI,
} from "@/config/contracts";

export function useTokenApproval() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isApproving, setIsApproving] = useState(false);
  const [approvalHash, setApprovalHash] = useState<string | null>(null);

  // Check if the contract has allowance to spend tokens
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: SUPERTOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address
      ? [address as `0x${string}`, CONTRACT_ADDRESS as `0x${string}`]
      : undefined,
  });

  // Get user's token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: SUPERTOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get token symbol
  const { data: symbol } = useReadContract({
    address: SUPERTOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: SUPERTOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  // Approve the contract to spend tokens
  const approveToken = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    setIsApproving(true);
    try {
      const hash = await writeContractAsync({
        address: SUPERTOKEN_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS as `0x${string}`, parseEther(amount)],
      });

      setApprovalHash(hash);

      // Refetch allowance after approval
      await refetchAllowance();

      return hash;
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  };

  // Check if the user has enough allowance for a specific amount
  const hasEnoughAllowance = (amount: string): boolean => {
    if (!allowance || !amount) return false;

    try {
      const amountBigInt = parseEther(amount);
      return allowance >= amountBigInt;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return false;
    }
  };

  // Format balance for display
  const formattedBalance = (): string => {
    if (!balance || !decimals) return "0";

    // This is a simplified version, in a real app you'd use a proper formatting library
    // Calculate divisor without using exponentiation operator
    let divisor = BigInt(1);
    for (let i = 0; i < Number(decimals); i++) {
      divisor = divisor * BigInt(10);
    }

    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;

    // Format to 6 decimal places
    const fractionalStr = fractionalPart
      .toString()
      .padStart(Number(decimals), "0")
      .slice(0, 6);

    return `${integerPart}.${fractionalStr} ${symbol || ""}`;
  };

  // Format allowance for display
  const formattedAllowance = (): string => {
    if (!allowance || !decimals) return "0";

    // This is a simplified version, in a real app you'd use a proper formatting library
    // Calculate divisor without using exponentiation operator
    let divisor = BigInt(1);
    for (let i = 0; i < Number(decimals); i++) {
      divisor = divisor * BigInt(10);
    }

    const integerPart = allowance / divisor;
    const fractionalPart = allowance % divisor;

    // Format to 6 decimal places
    const fractionalStr = fractionalPart
      .toString()
      .padStart(Number(decimals), "0")
      .slice(0, 6);

    return `${integerPart}.${fractionalStr} ${symbol || ""}`;
  };

  return {
    approveToken,
    hasEnoughAllowance,
    allowance,
    balance,
    formattedBalance,
    formattedAllowance,
    isApproving,
    approvalHash,
    symbol,
    refetchAllowance,
    refetchBalance,
  };
}
