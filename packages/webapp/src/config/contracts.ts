export const CONTRACT_ADDRESS = "0x56849c1c5dfbfa0620215171d1bef945e22db551";
export const SUPERTOKEN_ADDRESS = "0xb75F6aEf9F3BcE91856946bcB15B875ddEc68c2D";

export const CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [{ name: "_superToken", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "airdropDistribution",
    inputs: [
      { name: "poolId", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPool",
    inputs: [
      { name: "_poolName", type: "string", internalType: "string" },
      { name: "_poolSymbol", type: "string", internalType: "string" },
    ],
    outputs: [
      {
        name: "pool",
        type: "address",
        internalType: "contract ISuperfluidPool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "decreasePoolUnits",
    inputs: [{ name: "_poolId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "increasePoolUnits",
    inputs: [{ name: "_poolId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "poolCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pools",
    inputs: [{ name: "poolId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "pool",
        type: "address",
        internalType: "contract ISuperfluidPool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "streamDistribution",
    inputs: [
      { name: "poolId", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "duration", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "superToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ISuperToken",
      },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "PoolDoesNotExist", inputs: [] },
  {
    type: "error",
    name: "SafeCastOverflowedIntDowncast",
    inputs: [
      { name: "bits", type: "uint8", internalType: "uint8" },
      { name: "value", type: "int256", internalType: "int256" },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
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
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
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
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
