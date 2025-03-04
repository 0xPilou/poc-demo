"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFundPool } from "@/hooks/useFundPool";

// Form schema validation
const formSchema = z.object({
  flowRate: z.string().min(1, {
    message: "Flow rate is required.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  totalAmount: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StreamFundFormProps {
  poolId: number;
}

export function StreamFundForm({ poolId }: StreamFundFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);

  // Use the custom hook
  const {
    startDistribution,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
  } = useFundPool();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flowRate: "",
      duration: "",
      totalAmount: "",
    },
  });

  // Watch form values for calculations
  const flowRate = form.watch("flowRate");
  const duration = form.watch("duration");
  const totalAmount = form.watch("totalAmount");

  // Calculate total amount when flow rate and duration change
  useEffect(() => {
    if (flowRate && duration && !isCalculating) {
      const calculatedTotal = parseFloat(flowRate) * parseFloat(duration);
      if (!isNaN(calculatedTotal)) {
        form.setValue("totalAmount", calculatedTotal.toString());
      }
    }
  }, [flowRate, duration, form, isCalculating]);

  // Calculate duration when flow rate and total amount change
  useEffect(() => {
    if (flowRate && totalAmount && !isCalculating && !duration) {
      setIsCalculating(true);
      const calculatedDuration = parseFloat(totalAmount) / parseFloat(flowRate);
      if (!isNaN(calculatedDuration)) {
        form.setValue("duration", calculatedDuration.toString());
      }
      setIsCalculating(false);
    }
  }, [flowRate, totalAmount, form, duration, isCalculating]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    await startDistribution({
      poolId,
      flowRate: values.flowRate,
      duration: values.duration,
      totalAmount: values.totalAmount,
    });
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Stream started!",
        description: "Your distribution stream has been started successfully.",
      });

      // Reset form and redirect
      form.reset();
      router.push(`/pools/${poolId}`);
    }
  }, [isConfirmed, toast, form, router, poolId]);

  // Handle transaction error
  useEffect(() => {
    if (isError && error) {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  }, [isError, error, toast]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="flowRate">Flow Rate (tokens per second)</Label>
        <Input
          id="flowRate"
          type="number"
          placeholder="0.0"
          step="0.000001"
          {...form.register("flowRate")}
        />
        {form.formState.errors.flowRate && (
          <p className="text-sm text-red-500">
            {form.formState.errors.flowRate.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          placeholder="0"
          {...form.register("duration")}
        />
        {form.formState.errors.duration && (
          <p className="text-sm text-red-500">
            {form.formState.errors.duration.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalAmount">Total Amount (calculated)</Label>
        <Input
          id="totalAmount"
          type="number"
          placeholder="0.0"
          step="0.000001"
          {...form.register("totalAmount")}
        />
        <p className="text-xs text-muted-foreground">
          Total amount is calculated as flow rate × duration
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isConfirming || isSubmitting}
      >
        {isPending || isConfirming
          ? "Processing..."
          : "Start Distribution Stream"}
      </Button>
    </form>
  );
}
