"use client";

import React from "react";
import { CreatePoolForm } from "@/components/pools/create-pool-form";
import { FundPoolForm } from "@/components/pools/fund-pool-form";
import { PoolList } from "@/components/pools/pool-list";

export default function PoolsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Your Pools</h1>
      <div className="grid gap-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Create a New Pool</h2>
          <CreatePoolForm />
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Fund Your Pools</h2>
          <FundPoolForm />
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Pools</h2>
          <PoolList />
        </div>
      </div>
    </div>
  );
}
