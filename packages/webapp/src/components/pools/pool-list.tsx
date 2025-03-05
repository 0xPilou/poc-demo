import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ConnectWallet } from "../shared/connect-wallet";
import { useAccount } from "wagmi";

// Mock data - will be replaced with actual data from the contract
const mockPools = [
  {
    id: "1",
    name: "Community Rewards",
    description: "Rewards for active community members",
    distributionRate: "100",
    totalUnits: "1000",
    status: "active",
  },
  {
    id: "2",
    name: "Developer Incentives",
    description: "Incentives for contributing developers",
    distributionRate: "200",
    totalUnits: "500",
    status: "active",
  },
  {
    id: "3",
    name: "Content Creator Fund",
    description: "Rewards for content creators",
    distributionRate: "50",
    totalUnits: "2000",
    status: "paused",
  },
];

export function PoolList() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to view your pools.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectWallet />
        </CardContent>
      </Card>
    );
  }

  if (mockPools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Pools Found</CardTitle>
          <CardDescription>You haven't created any pools yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Create your first pool to start distributing rewards to your
            community.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Create Pool</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pools</CardTitle>
        <CardDescription>
          Manage and monitor your created pools.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Distribution Rate</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{pool.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {pool.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{pool.distributionRate} tokens/s</TableCell>
                <TableCell>{pool.totalUnits}</TableCell>
                <TableCell>
                  <Badge
                    variant={pool.status === "active" ? "default" : "secondary"}
                  >
                    {pool.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
