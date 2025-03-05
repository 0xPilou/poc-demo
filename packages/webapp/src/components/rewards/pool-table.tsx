import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ConnectWallet } from "../shared/connect-wallet";
import { useAccount } from "wagmi";

// Mock data - will be replaced with actual data from the contract
const mockPools = [
  {
    id: "1",
    name: "Community Rewards",
    rewardToken: "SUPER",
    flowRate: "100",
    totalUnits: "1000",
    userUnits: 50,
  },
  {
    id: "2",
    name: "Developer Incentives",
    rewardToken: "SUPER",
    flowRate: "200",
    totalUnits: "500",
    userUnits: 0,
  },
  {
    id: "3",
    name: "Content Creator Fund",
    rewardToken: "SUPER",
    flowRate: "50",
    totalUnits: "2000",
    userUnits: 100,
  },
];

export function PoolTable() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to view available pools.
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
          <CardTitle>No Pools Available</CardTitle>
          <CardDescription>
            There are currently no pools available to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Check back later for new opportunities to earn rewards.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Pools</CardTitle>
        <CardDescription>
          Browse and join pools to earn rewards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool Name</TableHead>
              <TableHead>Reward Token</TableHead>
              <TableHead>Flow Rate</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Your Units</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell className="font-medium">{pool.name}</TableCell>
                <TableCell>{pool.rewardToken}</TableCell>
                <TableCell>{pool.flowRate} tokens/s</TableCell>
                <TableCell>{pool.totalUnits}</TableCell>
                <TableCell>{pool.userUnits}</TableCell>
                <TableCell className="text-right">
                  {pool.userUnits > 0 ? (
                    <Badge>Subscribed</Badge>
                  ) : (
                    <Badge variant="outline">Not Subscribed</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
