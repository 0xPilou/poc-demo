import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAccount } from "wagmi";
import { ConnectWallet } from "../shared/connect-wallet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PoolCardProps {
  pool: {
    id: string;
    name: string;
    description: string;
    flowRate: string;
    rewardToken: string;
    userUnits: number;
    totalUnits: number;
  };
}

export function PoolCard({ pool }: PoolCardProps) {
  const { isConnected } = useAccount();
  const [collectAmount, setCollectAmount] = useState("1");
  const [decreaseAmount, setDecreaseAmount] = useState("1");
  const [isCollectDialogOpen, setIsCollectDialogOpen] = useState(false);
  const [isDecreaseDialogOpen, setIsDecreaseDialogOpen] = useState(false);

  const handleCollectUnits = () => {
    // This will be implemented with the contract interaction
    console.log(`Collecting ${collectAmount} units from pool ${pool.id}`);
    setIsCollectDialogOpen(false);
  };

  const handleDecreaseUnits = () => {
    // This will be implemented with the contract interaction
    console.log(`Decreasing ${decreaseAmount} units from pool ${pool.id}`);
    setIsDecreaseDialogOpen(false);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to interact with pools.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectWallet />
        </CardContent>
      </Card>
    );
  }

  // Calculate the user's share of the pool
  const userShare =
    pool.totalUnits > 0
      ? ((pool.userUnits / pool.totalUnits) * 100).toFixed(2)
      : "0.00";

  // Calculate projected rewards based on user's units and flow rate
  const projectedRewards = (
    parseFloat(pool.flowRate) *
    (pool.userUnits / pool.totalUnits)
  ).toFixed(6);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{pool.name}</CardTitle>
            <CardDescription>{pool.description}</CardDescription>
          </div>
          <Badge variant="outline">{pool.rewardToken}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Your Units
              </p>
              <p className="text-2xl font-bold">{pool.userUnits}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Units
              </p>
              <p className="text-2xl font-bold">{pool.totalUnits}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Your Share
            </p>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${userShare}%` }}
              ></div>
            </div>
            <p className="text-xs text-right">{userShare}%</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Flow Rate
            </p>
            <p className="text-lg">{pool.flowRate} tokens/second</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Projected Rewards
            </p>
            <p className="text-lg">{projectedRewards} tokens/second</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog
          open={isCollectDialogOpen}
          onOpenChange={setIsCollectDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="default">Collect Units</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Collect Units</DialogTitle>
              <DialogDescription>
                Enter the number of units you want to collect from this pool.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="collect-amount">Amount</Label>
                <Input
                  id="collect-amount"
                  type="number"
                  min="1"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCollectUnits}>Collect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDecreaseDialogOpen}
          onOpenChange={setIsDecreaseDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Decrease Units</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decrease Units</DialogTitle>
              <DialogDescription>
                Enter the number of units you want to remove from this pool.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="decrease-amount">Amount</Label>
                <Input
                  id="decrease-amount"
                  type="number"
                  min="1"
                  max={pool.userUnits.toString()}
                  value={decreaseAmount}
                  onChange={(e) => setDecreaseAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDecreaseUnits} variant="outline">
                Decrease
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
