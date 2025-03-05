import { useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { SUPERTOKEN_ADDRESS } from "@/config/contracts";

// Generic ERC20 ABI for approve and allowance functions
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useERC20Contract(
  tokenAddress: `0x${string}` = SUPERTOKEN_ADDRESS
) {
  const { address } = useAccount();

  // Approve spending of tokens
  const {
    data: approveHash,
    isPending: isApproveLoading,
    isSuccess: isApproveSuccess,
    writeContract: writeApprove,
  } = useWriteContract();

  const { isLoading: isApproveTxLoading, isSuccess: isApproveTxSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Get allowance
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowance,
  } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, tokenAddress] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get balance
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Wrapper function with proper args handling
  const approve = useCallback(
    (spender: `0x${string}`, amount: string) => {
      writeApprove({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spender, parseEther(amount)],
      });
    },
    [writeApprove, tokenAddress]
  );

  // Check if allowance is sufficient
  const hasAllowance = useCallback(
    (requiredAmount: string, spender: `0x${string}` = SUPERTOKEN_ADDRESS) => {
      if (!allowance) return false;
      return BigInt(allowance.toString()) >= parseEther(requiredAmount);
    },
    [allowance]
  );

  return {
    // Approve
    approve,
    isApproveLoading: isApproveLoading || isApproveTxLoading,
    isApproveSuccess: isApproveSuccess && isApproveTxSuccess,

    // Allowance
    allowance,
    isAllowanceLoading,
    refetchAllowance,
    hasAllowance,

    // Balance
    balance,
    isBalanceLoading,
    refetchBalance,
  };
}
