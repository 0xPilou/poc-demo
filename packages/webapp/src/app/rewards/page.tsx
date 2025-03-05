"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RewardsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          View Rewards
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Collect units from Superfluid Pools and claim your rewards.
        </p>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Pools</CardTitle>
              <CardDescription>
                Browse and interact with available Superfluid Pools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* PoolTable component will be implemented later */}
              <p className="text-gray-600 dark:text-gray-300">
                Pool Table will be implemented here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Rewards</CardTitle>
              <CardDescription>
                View your current rewards and units across all pools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* UnitActions component will be implemented later */}
              <p className="text-gray-600 dark:text-gray-300">
                Unit Actions will be implemented here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
