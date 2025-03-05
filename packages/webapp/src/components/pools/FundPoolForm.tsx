"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { usePools } from "@/hooks/usePools";
import { useTokenApproval } from "@/hooks/useTokenApproval";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Define the form schema for one-off payment
const oneOffSchema = z.object({
  poolId: z.string({
    required_error: "Please select a pool",
  }),
  amount: z
    .string()
    .min(1, {
      message: "Amount is required",
    })
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Amount must be a positive number",
    }),
});

// Define the form schema for streamed payment
const streamedSchema = z.object({
  poolId: z.string({
    required_error: "Please select a pool",
  }),
  flowRate: z
    .string()
    .min(1, {
      message: "Flow rate is required",
    })
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Flow rate must be a positive number",
    }),
  duration: z
    .string()
    .min(1, {
      message: "Duration is required",
    })
    .refine((value) => !isNaN(parseInt(value)) && parseInt(value) > 0, {
      message: "Duration must be a positive number",
    }),
});

type OneOffFormValues = z.infer<typeof oneOffSchema>;
type StreamedFormValues = z.infer<typeof streamedSchema>;

export function FundPoolForm() {
  const { pools, userPools, fundPoolOneTime, fundPoolStream, isFunding } =
    usePools();
  const {
    approveToken,
    hasEnoughAllowance,
    formattedBalance,
    formattedAllowance,
    isApproving,
    approvalHash,
    refetchAllowance,
  } = useTokenApproval();
  const { toast } = useToast();
  const [fundingType, setFundingType] = useState<"one-off" | "streamed">(
    "one-off"
  );
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<"approval" | "funding">(
    "approval"
  );

  // Initialize forms with react-hook-form
  const oneOffForm = useForm<OneOffFormValues>({
    resolver: zodResolver(oneOffSchema),
    defaultValues: {
      poolId: "",
      amount: "",
    },
  });

  const streamedForm = useForm<StreamedFormValues>({
    resolver: zodResolver(streamedSchema),
    defaultValues: {
      poolId: "",
      flowRate: "",
      duration: "",
    },
  });

  // Check if approval is needed when amount changes
  useEffect(() => {
    if (fundingType === "one-off") {
      const amount = oneOffForm.watch("amount");
      if (amount && !isNaN(parseFloat(amount))) {
        setCurrentAmount(amount);
        setNeedsApproval(!hasEnoughAllowance(amount));
      }
    } else {
      const flowRate = streamedForm.watch("flowRate");
      const duration = streamedForm.watch("duration");
      if (
        flowRate &&
        duration &&
        !isNaN(parseFloat(flowRate)) &&
        !isNaN(parseInt(duration))
      ) {
        // Calculate total amount needed for the stream
        const totalAmount = (
          parseFloat(flowRate) * parseInt(duration)
        ).toString();
        setCurrentAmount(totalAmount);
        setNeedsApproval(!hasEnoughAllowance(totalAmount));
      }
    }
  }, [
    fundingType,
    oneOffForm.watch("amount"),
    streamedForm.watch("flowRate"),
    streamedForm.watch("duration"),
    hasEnoughAllowance,
  ]);

  // Reset approval state when switching tabs
  useEffect(() => {
    setCurrentStep("approval");
    setNeedsApproval(false);
    setCurrentAmount("");
    setTransactionHash(null);
    setError(null);
  }, [fundingType]);

  // Function to estimate gas (placeholder for now)
  const estimateGas = async (data: OneOffFormValues | StreamedFormValues) => {
    // In a real implementation, you would call a contract method to estimate gas
    // For now, we'll just simulate it
    setGasEstimate("~0.003 ETH");
  };

  // Handle token approval
  const handleApprove = async () => {
    try {
      setError(null);

      // Add a buffer to the approval amount (e.g., 10% more)
      const bufferAmount = (parseFloat(currentAmount) * 1.1).toString();

      const hash = await approveToken(bufferAmount);

      toast({
        title: "Token approval successful",
        description: `You've approved ${bufferAmount} tokens for spending.`,
      });

      // Move to the funding step
      setCurrentStep("funding");

      return hash;
    } catch (err) {
      console.error("Error approving token:", err);
      setError(err instanceof Error ? err.message : "Failed to approve token");

      toast({
        variant: "destructive",
        title: "Failed to approve token",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  // Handle one-off payment form submission
  const onSubmitOneOff = async (data: OneOffFormValues) => {
    try {
      // Check if approval is still needed
      if (needsApproval) {
        toast({
          variant: "destructive",
          title: "Token approval required",
          description: "Please approve token spending before funding the pool.",
        });
        return;
      }

      setError(null);
      setTransactionHash(null);

      // Call the fundPoolOneTime function from the usePools hook
      const hash = await fundPoolOneTime(data.poolId, data.amount);
      setTransactionHash(hash);

      // Reset the form
      oneOffForm.reset();
      setCurrentStep("approval");

      // Show success toast
      toast({
        title: "Pool funded successfully!",
        description: `You've added ${data.amount} tokens to the pool.`,
      });
    } catch (err) {
      console.error("Error funding pool:", err);
      setError(err instanceof Error ? err.message : "Failed to fund pool");

      // Show error toast
      toast({
        variant: "destructive",
        title: "Failed to fund pool",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  // Handle streamed payment form submission
  const onSubmitStreamed = async (data: StreamedFormValues) => {
    try {
      // Calculate total amount needed for the stream
      const totalAmount = (
        parseFloat(data.flowRate) * parseInt(data.duration)
      ).toString();

      // Check if approval is still needed
      if (!hasEnoughAllowance(totalAmount)) {
        toast({
          variant: "destructive",
          title: "Token approval required",
          description:
            "Please approve token spending before starting the stream.",
        });
        return;
      }

      setError(null);
      setTransactionHash(null);

      // Call the fundPoolStream function from the usePools hook
      const hash = await fundPoolStream(
        data.poolId,
        data.flowRate,
        data.duration
      );
      setTransactionHash(hash);

      // Reset the form
      streamedForm.reset();
      setCurrentStep("approval");

      // Show success toast
      toast({
        title: "Stream started successfully!",
        description: `You've started a stream of ${data.flowRate} tokens per second for ${data.duration} seconds.`,
      });
    } catch (err) {
      console.error("Error starting stream:", err);
      setError(err instanceof Error ? err.message : "Failed to start stream");

      // Show error toast
      toast({
        variant: "destructive",
        title: "Failed to start stream",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  // Update gas estimate when form values change
  const handleOneOffFormChange = () => {
    const values = oneOffForm.getValues();
    if (values.poolId && values.amount && !isNaN(parseFloat(values.amount))) {
      estimateGas(values);
    } else {
      setGasEstimate(null);
    }
  };

  const handleStreamedFormChange = () => {
    const values = streamedForm.getValues();
    if (
      values.poolId &&
      values.flowRate &&
      !isNaN(parseFloat(values.flowRate)) &&
      values.duration &&
      !isNaN(parseInt(values.duration))
    ) {
      estimateGas(values);
    } else {
      setGasEstimate(null);
    }
  };

  // Get the selected pool name for display
  const getPoolName = (poolId: string) => {
    const pool = pools.find((p) => p.id === poolId);
    return pool ? pool.name : "Unknown Pool";
  };

  // Render the approval step
  const renderApprovalStep = () => {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-400">
            Token Approval Required
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-500">
            <div>
              Before funding the pool, you need to approve the contract to spend
              your tokens.
            </div>
            <div className="mt-1">
              Your current balance: {formattedBalance()}
            </div>
            <div className="mt-1">
              Current allowance: {formattedAllowance()}
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Approval Status:</div>
          <div className="text-sm">
            {needsApproval ? (
              <span className="text-red-500">Approval needed</span>
            ) : (
              <span className="text-green-500">Already approved</span>
            )}
          </div>
        </div>

        <Progress value={needsApproval ? 0 : 100} className="h-2" />

        {needsApproval && currentAmount && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {currentAmount &&
                `Required for this transaction: ${currentAmount}`}
            </div>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving Tokens...
                </>
              ) : (
                `Approve ${currentAmount} Tokens`
              )}
            </Button>
          </div>
        )}

        {!needsApproval && (
          <Button onClick={() => setCurrentStep("funding")} className="w-full">
            Continue to Funding
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="one-off"
        onValueChange={(value) =>
          setFundingType(value as "one-off" | "streamed")
        }
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="one-off">One-off Payment</TabsTrigger>
          <TabsTrigger value="streamed">Streamed Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="one-off">
          {currentStep === "approval" ? (
            renderApprovalStep()
          ) : (
            <Form {...oneOffForm}>
              <form
                onSubmit={oneOffForm.handleSubmit(onSubmitOneOff)}
                onChange={handleOneOffFormChange}
                className="space-y-6"
              >
                <FormField
                  control={oneOffForm.control}
                  name="poolId"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<OneOffFormValues, "poolId">;
                  }) => (
                    <FormItem>
                      <FormLabel>Select Pool</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pool" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userPools.length > 0 ? (
                            userPools.map((pool) => (
                              <SelectItem key={pool.id} value={pool.id}>
                                {pool.name} ({pool.tokenSymbol})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-pools" disabled>
                              No pools available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a pool to fund with a one-time payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={oneOffForm.control}
                  name="amount"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<OneOffFormValues, "amount">;
                  }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          min="0"
                          placeholder="0.0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The amount of tokens to distribute to the pool.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {gasEstimate && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Estimated gas cost: {gasEstimate}
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("approval")}
                    className="flex-1"
                  >
                    Back to Approval
                  </Button>
                  <Button
                    type="submit"
                    disabled={isFunding || needsApproval}
                    className="flex-1"
                  >
                    {isFunding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Funding Pool...
                      </>
                    ) : (
                      "Fund Pool"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="streamed">
          {currentStep === "approval" ? (
            renderApprovalStep()
          ) : (
            <Form {...streamedForm}>
              <form
                onSubmit={streamedForm.handleSubmit(onSubmitStreamed)}
                onChange={handleStreamedFormChange}
                className="space-y-6"
              >
                <FormField
                  control={streamedForm.control}
                  name="poolId"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<StreamedFormValues, "poolId">;
                  }) => (
                    <FormItem>
                      <FormLabel>Select Pool</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pool" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userPools.length > 0 ? (
                            userPools.map((pool) => (
                              <SelectItem key={pool.id} value={pool.id}>
                                {pool.name} ({pool.tokenSymbol})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-pools" disabled>
                              No pools available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a pool to fund with a streamed payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={streamedForm.control}
                  name="flowRate"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      StreamedFormValues,
                      "flowRate"
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel>Flow Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          min="0"
                          placeholder="0.0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The amount of tokens to distribute per second.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={streamedForm.control}
                  name="duration"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      StreamedFormValues,
                      "duration"
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel>Duration (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min="1"
                          placeholder="86400"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How long the stream should last in seconds (e.g., 86400
                        for 1 day).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {gasEstimate && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Estimated gas cost: {gasEstimate}
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("approval")}
                    className="flex-1"
                  >
                    Back to Approval
                  </Button>
                  <Button
                    type="submit"
                    disabled={isFunding || needsApproval}
                    className="flex-1"
                  >
                    {isFunding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Stream...
                      </>
                    ) : (
                      "Start Stream"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>

      {transactionHash && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">
            Transaction Successful
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-500">
            <div>Transaction Hash: {formatAddress(transactionHash)}</div>
            <div className="mt-1">
              {fundingType === "one-off"
                ? `You've successfully funded ${getPoolName(oneOffForm.getValues().poolId)}`
                : `You've successfully started a stream to ${getPoolName(streamedForm.getValues().poolId)}`}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
