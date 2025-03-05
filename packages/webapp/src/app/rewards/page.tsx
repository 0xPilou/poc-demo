"use client";

import React from "react";
import { PoolTable } from "@/components/rewards/pool-table";
import { PoolCard } from "@/components/rewards/pool-card";
import { usePools } from "@/hooks/use-pools";

export default function RewardsPage() {
  // In a real implementation, we would use the usePools hook to get the pools
  // For now, we'll use mock data
  const mockPools = [
    {
      id: "1",
      name: "Community Rewards",
      description: "Rewards for active community members",
      flowRate: "100",
      rewardToken: "SUPER",
      userUnits: 50,
      totalUnits: 1000,
    },
    {
      id: "2",
      name: "Developer Incentives",
      description: "Incentives for contributing developers",
      flowRate: "200",
      rewardToken: "SUPER",
      userUnits: 0,
      totalUnits: 500,
    },
    {
      id: "3",
      name: "Content Creator Fund",
      description: "Rewards for content creators",
      flowRate: "50",
      rewardToken: "SUPER",
      userUnits: 100,
      totalUnits: 2000,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Pools</h1>
      <p className="text-lg mb-6">
        Subscribe to pools and earn rewards by collecting units.
      </p>

      <div className="mb-8">
        <PoolTable />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} />
        ))}
      </div>
    </div>
  );
}
