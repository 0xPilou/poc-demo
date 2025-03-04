export const CONTRACT_ADDRESS = "0x29754F3d807EC91066cF2693c92922E036E27E08";

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
      {
        name: "_superToken",
        type: "address",
        internalType: "contract ISuperToken",
      },
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
] as const;
