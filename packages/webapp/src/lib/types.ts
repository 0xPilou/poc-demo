// Pool type definition
export interface Pool {
  id: string;
  address: string;
  name: string;
  superToken: string;
  tokenSymbol: string;
  totalUnits: string;
  userUnits?: string;
  flowRate: string;
  createdAt: number;
  owner: string;
  isActive: boolean;
}

// Distribution type definition
export interface Distribution {
  id: string;
  poolId: string;
  amount: string;
  flowRate: string;
  startTime: number;
  endTime?: number;
  isStreaming: boolean;
}

// User type definition
export interface User {
  address: string;
  pools: string[]; // Array of pool IDs the user has created
  units: {
    [poolId: string]: string; // Mapping of pool ID to units owned
  };
}
