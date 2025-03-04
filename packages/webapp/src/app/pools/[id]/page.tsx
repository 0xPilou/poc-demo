"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePool } from "@/hooks/usePool";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

export default function PoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const poolId = parseInt(params.id as string);

  const { pool, isLoading, error } = usePool(poolId);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pool details. Please try again.",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Details</h1>
          <Button variant="outline" onClick={() => router.push("/pools")}>
            Back to Pools
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Loading pool details...</p>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Details</h1>
          <Button variant="outline" onClick={() => router.push("/pools")}>
            Back to Pools
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <p>Pool not found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pool Details</h1>
        <Button variant="outline" onClick={() => router.push("/pools")}>
          Back to Pools
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{pool.name}</CardTitle>
            <CardDescription>{pool.symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pool ID</p>
                  <p>{pool.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pool Address</p>
                  <p className="truncate">{pool.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin</p>
                  <p className="truncate">{pool.admin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token</p>
                  <p>{pool.tokenSymbol}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flow Rate</p>
                  <p>{pool.flowRate} tokens/second</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p>{pool.totalUnits}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p>{new Date(pool.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={() => router.push(`/pools/${pool.id}/fund`)}
                  className="flex items-center gap-2"
                >
                  <Coins className="h-4 w-4" />
                  Fund Pool
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/pools/${pool.id}/collect`)}
                >
                  Collect Units
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
