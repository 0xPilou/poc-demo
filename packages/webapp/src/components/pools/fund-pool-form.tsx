import React, { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ConnectWallet } from "../shared/connect-wallet";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useDemoGDAContract } from "@/hooks/use-demo-gda-contract";
import { useERC20Contract } from "@/hooks/use-erc20-contract";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { DEMO_GDA_ADDRESS, SUPERTOKEN_ADDRESS } from "@/config/contracts";
import { Label } from "../ui/label";
import { HelpCircle } from "lucide-react";

const airdropFormSchema = z.object({
  poolId: z.string().min(1, "Pool ID is required"),
  amount: z.string().min(1, "Amount is required"),
});

const streamFormSchema = z.object({
  poolId: z.string().min(1, "Pool ID is required"),
  flowRate: z.string().min(1, "Flow rate is required"),
  duration: z.string().min(1, "Duration is required"),
});

type AirdropFormValues = z.infer<typeof airdropFormSchema>;
type StreamFormValues = z.infer<typeof streamFormSchema>;

export function FundPoolForm() {
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState<"airdrop" | "stream">(
    "airdrop"
  );
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showFundSuccess, setShowFundSuccess] = useState(false);

  // Contract hooks
  const {
    airdropDistribution,
    isAirdropLoading,
    isAirdropSuccess,
    startDistribution,
    isStartDistributionLoading,
    isStartDistributionSuccess,
    allPools,
    isAllPoolsLoading,
  } = useDemoGDAContract();

  const {
    approve,
    isApproveLoading,
    isApproveSuccess,
    allowance,
    hasAllowance,
    balance,
    isBalanceLoading,
  } = useERC20Contract();

  // Reset success messages when changing tabs
  useEffect(() => {
    setShowApprovalSuccess(false);
    setShowFundSuccess(false);
  }, [selectedTab]);

  // Show success message when approval is successful
  useEffect(() => {
    if (isApproveSuccess) {
      setShowApprovalSuccess(true);
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowApprovalSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isApproveSuccess]);

  // Show success message when fund action is successful
  useEffect(() => {
    if (isAirdropSuccess || isStartDistributionSuccess) {
      setShowFundSuccess(true);
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowFundSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAirdropSuccess, isStartDistributionSuccess]);

  // Airdrop form
  const airdropForm = useForm<z.infer<typeof airdropFormSchema>>({
    resolver: zodResolver(airdropFormSchema),
    defaultValues: {
      poolId: "",
      amount: "",
    },
  });

  // Stream form
  const streamForm = useForm<z.infer<typeof streamFormSchema>>({
    resolver: zodResolver(streamFormSchema),
    defaultValues: {
      poolId: "",
      flowRate: "",
      duration: "86400", // 1 day in seconds
    },
  });

  // Handle airdrop form submission
  const onAirdropSubmit = (values: z.infer<typeof airdropFormSchema>) => {
    if (!address) return;

    // Check if user has enough allowance
    if (!hasAllowance(values.amount)) {
      // If not, request approval
      approve(SUPERTOKEN_ADDRESS, values.amount);
      return;
    }

    // If user has allowance, proceed with airdrop
    airdropDistribution(values.poolId, values.amount);
  };

  // Handle stream form submission
  const onStreamSubmit = (values: z.infer<typeof streamFormSchema>) => {
    if (!address) return;

    // Check if user has enough allowance
    if (!hasAllowance(values.flowRate)) {
      // If not, request approval
      approve(SUPERTOKEN_ADDRESS, values.flowRate);
      return;
    }

    // If user has allowance, proceed with stream
    startDistribution(values.poolId, values.flowRate, values.duration);
  };

  // Format balance for display
  const formattedBalance = useMemo(() => {
    if (!balance) return "0";
    return parseFloat(balance.toString()) / 1e18;
  }, [balance]);

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to fund a pool.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectWallet />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Fund Pool</CardTitle>
          <CardDescription>
            Distribute tokens to a pool via airdrop or streaming payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Connected wallet status */}
          <div className="mb-4 p-2 bg-muted rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="text-xs text-muted-foreground">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Not connected"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Balance</p>
              <p className="text-xs text-muted-foreground">
                {isBalanceLoading ? "Loading..." : `${formattedBalance} SUPER`}
              </p>
            </div>
          </div>

          {/* Success messages */}
          {showApprovalSuccess && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Token approval successful. You can now proceed with funding.
              </AlertDescription>
            </Alert>
          )}

          {showFundSuccess && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {selectedTab === "airdrop"
                  ? "Airdrop distribution successful!"
                  : "Stream distribution started successfully!"}
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs */}
          <Tabs
            defaultValue="airdrop"
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "airdrop" | "stream")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="airdrop">Airdrop</TabsTrigger>
              <TabsTrigger value="stream">Stream</TabsTrigger>
            </TabsList>

            {/* Airdrop Tab */}
            <TabsContent value="airdrop">
              <form
                onSubmit={airdropForm.handleSubmit(onAirdropSubmit)}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="airdrop-pool-id"
                            className="flex items-center"
                          >
                            Pool ID <HelpCircle className="ml-1 h-3 w-3" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Select the pool you want to fund with an airdrop
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      airdropForm.setValue("poolId", value)
                    }
                    defaultValue={airdropForm.getValues("poolId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAllPoolsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading pools...
                        </SelectItem>
                      ) : (
                        allPools?.map((poolId) => (
                          <SelectItem key={poolId} value={poolId}>
                            Pool {poolId}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {airdropForm.formState.errors.poolId && (
                    <p className="text-sm text-destructive">
                      {airdropForm.formState.errors.poolId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="airdrop-amount"
                            className="flex items-center"
                          >
                            Amount <HelpCircle className="ml-1 h-3 w-3" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The amount of tokens to distribute in a one-time
                            airdrop
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="airdrop-amount"
                    type="text"
                    placeholder="Enter amount"
                    {...airdropForm.register("amount")}
                  />
                  {airdropForm.formState.errors.amount && (
                    <p className="text-sm text-destructive">
                      {airdropForm.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAirdropLoading || isApproveLoading}
                >
                  {isAirdropLoading || isApproveLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {hasAllowance(airdropForm.getValues("amount"))
                        ? "Processing Airdrop..."
                        : "Approving Tokens..."}
                    </>
                  ) : hasAllowance(airdropForm.getValues("amount")) ? (
                    "Airdrop Tokens"
                  ) : (
                    "Approve Tokens"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Stream Tab */}
            <TabsContent value="stream">
              <form
                onSubmit={streamForm.handleSubmit(onStreamSubmit)}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="stream-pool-id"
                            className="flex items-center"
                          >
                            Pool ID <HelpCircle className="ml-1 h-3 w-3" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the pool you want to fund with a stream</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      streamForm.setValue("poolId", value)
                    }
                    defaultValue={streamForm.getValues("poolId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAllPoolsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading pools...
                        </SelectItem>
                      ) : (
                        allPools?.map((poolId) => (
                          <SelectItem key={poolId} value={poolId}>
                            Pool {poolId}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {streamForm.formState.errors.poolId && (
                    <p className="text-sm text-destructive">
                      {streamForm.formState.errors.poolId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="stream-flow-rate"
                            className="flex items-center"
                          >
                            Flow Rate <HelpCircle className="ml-1 h-3 w-3" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The rate at which tokens will be streamed (tokens
                            per second)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="stream-flow-rate"
                    type="text"
                    placeholder="Enter flow rate"
                    {...streamForm.register("flowRate")}
                  />
                  {streamForm.formState.errors.flowRate && (
                    <p className="text-sm text-destructive">
                      {streamForm.formState.errors.flowRate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="stream-duration"
                            className="flex items-center"
                          >
                            Duration (seconds){" "}
                            <HelpCircle className="ml-1 h-3 w-3" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            How long the stream will last in seconds (default: 1
                            day)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="stream-duration"
                    type="text"
                    placeholder="Enter duration in seconds"
                    {...streamForm.register("duration")}
                  />
                  {streamForm.formState.errors.duration && (
                    <p className="text-sm text-destructive">
                      {streamForm.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isStartDistributionLoading || isApproveLoading}
                >
                  {isStartDistributionLoading || isApproveLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {hasAllowance(streamForm.getValues("flowRate"))
                        ? "Starting Stream..."
                        : "Approving Tokens..."}
                    </>
                  ) : hasAllowance(streamForm.getValues("flowRate")) ? (
                    "Start Stream"
                  ) : (
                    "Approve Tokens"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
