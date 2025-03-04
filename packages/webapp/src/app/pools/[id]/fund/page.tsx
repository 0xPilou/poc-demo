"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFundPool } from "@/hooks/useFundPool";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, SUPERTOKEN_ADDRESS } from "@/config/contracts";
import { erc20Abi } from "viem";

// Form schema validation for airdrop
const airdropFormSchema = z.object({
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
});

// Form schema validation for stream
const streamFormSchema = z.object({
  totalAmount: z.string().min(1, {
    message: "Total amount is required.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
});

type AirdropFormValues = z.infer<typeof airdropFormSchema>;
type StreamFormValues = z.infer<typeof streamFormSchema>;

export default function FundPoolPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const poolId = parseInt(params.id as string);
  const [activeTab, setActiveTab] = useState("airdrop");
  const [isApproving, setIsApproving] = useState(false);

  const { pool, isLoading, error } = usePool(poolId);
  const {
    airdropDistribution,
    startDistribution,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error: fundError,
  } = useFundPool();

  // For token approvals
  const { writeContract: approveToken, isPending: isApprovePending } =
    useWriteContract();

  // Airdrop form setup
  const airdropForm = useForm<AirdropFormValues>({
    resolver: zodResolver(airdropFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  // Stream form setup
  const streamForm = useForm<StreamFormValues>({
    resolver: zodResolver(streamFormSchema),
    defaultValues: {
      totalAmount: "",
      duration: "",
    },
  });

  // Watch stream form values for calculations
  const duration = streamForm.watch("duration");
  const totalAmount = streamForm.watch("totalAmount");

  // Calculate flow rate when total amount and duration change
  useEffect(() => {
    if (totalAmount && duration) {
      const calculatedFlowRate = parseFloat(totalAmount) / parseFloat(duration);
      if (!isNaN(calculatedFlowRate)) {
        // This is just for display, we don't need to store it in the form
        setFlowRate(calculatedFlowRate.toString());
      }
    }
  }, [totalAmount, duration]);

  // For displaying calculated flow rate
  const [flowRate, setFlowRate] = useState("");

  // Handle token approval
  const handleApprove = async (amount: string) => {
    if (!pool) return;

    setIsApproving(true);
    try {
      // Convert amount to BigInt with 18 decimals
      const amountBigInt = BigInt(parseFloat(amount) * 1e18);

      approveToken({
        address: SUPERTOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACT_ADDRESS as `0x${string}`, amountBigInt],
      });

      toast({
        title: "Approving tokens...",
        description: "Please confirm the transaction in your wallet.",
      });

      return true;
    } catch (err) {
      console.error("Error approving tokens:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve tokens. Please try again.",
      });
      setIsApproving(false);
      return false;
    }
  };

  // Handle airdrop form submission
  const onAirdropSubmit = async (values: AirdropFormValues) => {
    // First approve tokens
    const approved = await handleApprove(values.amount);
    if (!approved) return;

    // Then airdrop distribution
    await airdropDistribution({
      poolId,
      amount: values.amount,
    });
  };

  // Handle stream form submission
  const onStreamSubmit = async (values: StreamFormValues) => {
    // First approve tokens
    const approved = await handleApprove(values.totalAmount);
    if (!approved) return;

    // Then start distribution
    await startDistribution({
      poolId,
      totalAmount: values.totalAmount,
      duration: values.duration,
    });
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: activeTab === "airdrop" ? "Pool funded!" : "Stream started!",
        description:
          activeTab === "airdrop"
            ? "Your one-off payment has been processed successfully."
            : "Your distribution stream has been started successfully.",
      });

      // Reset forms and redirect
      airdropForm.reset();
      streamForm.reset();
      router.push(`/pools/${poolId}`);
    }
  }, [isConfirmed, toast, airdropForm, streamForm, router, poolId, activeTab]);

  // Handle transaction error
  useEffect(() => {
    if (isError && fundError) {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description:
          fundError.message || "Something went wrong. Please try again.",
      });
      setIsApproving(false);
    }
  }, [isError, fundError, toast]);

  // Handle pool loading error
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
          <h1 className="text-3xl font-bold">Fund Pool</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/pools/${poolId}`)}
          >
            Back to Pool
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
          <h1 className="text-3xl font-bold">Fund Pool</h1>
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
        <h1 className="text-3xl font-bold">Fund Pool</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/pools/${poolId}`)}
        >
          Back to Pool
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{pool.name}</CardTitle>
          <CardDescription>
            Pool ID: {pool.id} | Symbol: {pool.symbol}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fund Pool</CardTitle>
          <CardDescription>
            Choose how you want to fund this pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="airdrop"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="airdrop">
                One-off Payment (Airdrop)
              </TabsTrigger>
              <TabsTrigger value="stream">Streamed Payment</TabsTrigger>
            </TabsList>

            {/* Airdrop Form */}
            <TabsContent value="airdrop" className="mt-6">
              <form
                onSubmit={airdropForm.handleSubmit(onAirdropSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    step="0.000001"
                    {...airdropForm.register("amount")}
                  />
                  {airdropForm.formState.errors.amount && (
                    <p className="text-sm text-red-500">
                      {airdropForm.formState.errors.amount.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This will first approve the token transfer, then execute the
                    airdrop.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isPending ||
                    isConfirming ||
                    isSubmitting ||
                    isApproving ||
                    isApprovePending
                  }
                >
                  {isApproving || isApprovePending
                    ? "Approving Tokens..."
                    : isPending || isConfirming
                      ? "Processing..."
                      : "Fund Pool"}
                </Button>
              </form>
            </TabsContent>

            {/* Stream Form */}
            <TabsContent value="stream" className="mt-6">
              <form
                onSubmit={streamForm.handleSubmit(onStreamSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="0.0"
                    step="0.000001"
                    {...streamForm.register("totalAmount")}
                  />
                  {streamForm.formState.errors.totalAmount && (
                    <p className="text-sm text-red-500">
                      {streamForm.formState.errors.totalAmount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="0"
                    {...streamForm.register("duration")}
                  />
                  {streamForm.formState.errors.duration && (
                    <p className="text-sm text-red-500">
                      {streamForm.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                {flowRate && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm font-medium">Calculated Flow Rate</p>
                    <p className="text-lg">
                      {parseFloat(flowRate).toFixed(6)} tokens per second
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Flow rate is calculated as total amount ÷ duration
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  This will first approve the token transfer, then start the
                  distribution stream.
                </p>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isPending ||
                    isConfirming ||
                    isSubmitting ||
                    isApproving ||
                    isApprovePending
                  }
                >
                  {isApproving || isApprovePending
                    ? "Approving Tokens..."
                    : isPending || isConfirming
                      ? "Processing..."
                      : "Start Distribution Stream"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
