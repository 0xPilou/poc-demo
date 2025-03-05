import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function MemberCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Community Member</h3>

        <p className="text-muted-foreground">
          Subscribe to Superfluid Pools and earn rewards by collecting units.
          Receive continuous streaming payments based on your participation.
        </p>

        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Discover available reward pools</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Collect units to earn rewards</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Receive real-time streaming payments</span>
          </li>
        </ul>

        <div className="pt-4">
          <Link href="/rewards">
            <Button className="w-full" variant="outline">
              Explore Rewards
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
