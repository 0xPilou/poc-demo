"use client";

import { Card } from "@/components/common/Card";
import { Users, Coins } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Superfluid Pools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A web3 platform for creating, funding, and collecting rewards from
            Superfluid Pools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card
            title="Create & Fund Reward Pools"
            description="As a community owner, you can create and fund Superfluid Pools to distribute rewards to your community."
            icon={Users}
            benefits={[
              "Easy pool creation with flexible parameters",
              "Fund pools with one-time or streamed payments",
              "Transparent distribution to community members",
            ]}
            ctaText="Manage Pools"
            ctaLink="/pools"
            className="transform transition-all duration-300 hover:scale-105"
          />

          <Card
            title="Collect Rewards from Pools"
            description="As a community member, you can collect units from Superfluid Pools and claim your rewards."
            icon={Coins}
            benefits={[
              "View all available pools in one place",
              "Collect units to increase your rewards",
              "Receive streaming rewards in real-time",
            ]}
            ctaText="View Rewards"
            ctaLink="/rewards"
            className="transform transition-all duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
