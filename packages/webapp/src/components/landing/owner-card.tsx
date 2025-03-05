import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function OwnerCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Community Owner</h3>

        <p className="text-muted-foreground">
          Create and manage Superfluid Pools to distribute rewards to your
          community members. Set up one-time airdrops or continuous streaming
          payments.
        </p>

        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Create customized reward pools</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Fund pools with one-time or streaming payments</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Monitor distribution and engagement</span>
          </li>
        </ul>

        <div className="pt-4">
          <Link href="/pools">
            <Button className="w-full">
              Manage Pools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
