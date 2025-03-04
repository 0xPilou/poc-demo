"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreatePoolForm } from "@/components/pools/CreatePoolForm";
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
import { Coins, Plus } from "lucide-react";

export default function PoolsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { pools, isLoading, error } = usePools();

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
      <h1 className="text-3xl font-bold mb-6">Pools Management</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Create Pool Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create a New Pool</CardTitle>
            <CardDescription>
              Create a new Superfluid Pool to distribute rewards to your
              community members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePoolForm />
          </CardContent>
        </Card>

        {/* Pools List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Pools</CardTitle>
            <CardDescription>
              Manage your existing Superfluid Pools
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading pools...</p>
              </div>
            ) : pools.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32">
                <p className="text-muted-foreground mb-4">
                  You don't have any pools yet.
                </p>
                <Button
                  onClick={() =>
                    document
                      .getElementById("create-pool-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Pool
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pools.map((pool) => (
                  <Card key={pool.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{pool.name}</CardTitle>
                      <CardDescription>{pool.symbol}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Pool ID:
                          </span>
                          <span>{pool.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Flow Rate:
                          </span>
                          <span>{pool.flowRate} tokens/sec</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total Units:
                          </span>
                          <span>{pool.totalUnits}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => router.push(`/pools/${pool.id}`)}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1"
                          onClick={() => router.push(`/pools/${pool.id}/fund`)}
                        >
                          <Coins className="h-3 w-3" />
                          Fund
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
