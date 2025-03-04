"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePools } from "@/hooks/usePools";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Info } from "lucide-react";
import { Pool } from "@/lib/types";
import { CollectUnitsModal } from "@/components/pools/CollectUnitsModal";
import { DecreaseUnitsModal } from "@/components/pools/DecreaseUnitsModal";

export default function RewardsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { pools, isLoading, error } = usePools();

  // State for modals
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isDecreaseModalOpen, setIsDecreaseModalOpen] = useState(false);

  // Sorting options
  const [sortOption, setSortOption] = useState<string>("flowRate");

  // Filtering options
  const [filterToken, setFilterToken] = useState<string | null>(null);
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);

  // Sorted and filtered pools
  const sortedAndFilteredPools = [...pools]
    .filter((pool) => {
      // Filter by token if selected
      if (filterToken && pool.tokenSymbol !== filterToken) return false;

      // Filter by subscription if enabled
      // This is a placeholder - you'll need to implement actual subscription checking
      if (showSubscribedOnly && pool.userUnits === "0") return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "flowRate":
          return parseFloat(b.flowRate) - parseFloat(a.flowRate);
        case "totalUnits":
          return parseFloat(b.totalUnits) - parseFloat(a.totalUnits);
        case "createdAt":
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

  // Handle collect units
  const handleCollectUnits = (pool: Pool) => {
    setSelectedPool(pool);
    setIsCollectModalOpen(true);
  };

  // Handle decrease units
  const handleDecreaseUnits = (pool: Pool) => {
    setSelectedPool(pool);
    setIsDecreaseModalOpen(true);
  };

  // Get unique token symbols for filtering
  const tokenSymbols = [...new Set(pools.map((pool) => pool.tokenSymbol))];

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pools. Please try again.",
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Reward Pools</h1>

      {/* Sorting and Filtering Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Sort by</label>
          <select
            className="w-full p-2 border rounded-md bg-background"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="flowRate">Highest Flow Rate</option>
            <option value="totalUnits">Most Popular</option>
            <option value="createdAt">Recently Created</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Filter by Token
          </label>
          <select
            className="w-full p-2 border rounded-md bg-background"
            value={filterToken || ""}
            onChange={(e) => setFilterToken(e.target.value || null)}
          >
            <option value="">All Tokens</option>
            {tokenSymbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5"
              checked={showSubscribedOnly}
              onChange={() => setShowSubscribedOnly(!showSubscribedOnly)}
            />
            <span>Show only subscribed pools</span>
          </label>
        </div>
      </div>

      {/* Pools List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Pools</CardTitle>
          <CardDescription>
            Browse and subscribe to reward pools
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading pools...</p>
            </div>
          ) : sortedAndFilteredPools.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-32">
              <p className="text-muted-foreground mb-4">
                No pools available with the current filters.
              </p>
              <Button
                onClick={() => {
                  setFilterToken(null);
                  setShowSubscribedOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredPools.map((pool) => (
                <Card key={pool.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    <CardDescription>{pool.tokenSymbol}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Flow Rate:
                        </span>
                        <span>
                          {parseFloat(pool.flowRate).toFixed(6)} tokens/sec
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Your Units:
                        </span>
                        <span>{pool.userUnits || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Units:
                        </span>
                        <span>{pool.totalUnits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Est. Rewards/Unit:
                        </span>
                        <span>
                          {parseFloat(pool.totalUnits) > 0
                            ? (
                                parseFloat(pool.flowRate) /
                                parseFloat(pool.totalUnits)
                              ).toFixed(8)
                            : "0"}{" "}
                          tokens/sec
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => router.push(`/pools/${pool.id}`)}
                      >
                        <Info className="h-3 w-3" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => handleCollectUnits(pool)}
                      >
                        <Plus className="h-3 w-3" />
                        Collect
                      </Button>
                      {pool.userUnits && parseFloat(pool.userUnits) > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1"
                          onClick={() => handleDecreaseUnits(pool)}
                        >
                          <Minus className="h-3 w-3" />
                          Decrease
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPool && (
        <>
          <CollectUnitsModal
            pool={selectedPool}
            isOpen={isCollectModalOpen}
            onClose={() => setIsCollectModalOpen(false)}
          />
          <DecreaseUnitsModal
            pool={selectedPool}
            isOpen={isDecreaseModalOpen}
            onClose={() => setIsDecreaseModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
