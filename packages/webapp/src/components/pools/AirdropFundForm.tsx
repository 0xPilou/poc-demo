"use client";

import { useEffect } from "react";
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
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AirdropFundFormProps {
  poolId: number;
}

export function AirdropFundForm({ poolId }: AirdropFundFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Use the custom hook
  const {
    airdropDistribution,
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
      amount: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    await airdropDistribution({
      poolId,
      amount: values.amount,
    });
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Pool funded!",
        description: "Your one-off payment has been processed successfully.",
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
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.0"
          step="0.000001"
          {...form.register("amount")}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isConfirming || isSubmitting}
      >
        {isPending || isConfirming ? "Processing..." : "Fund Pool"}
      </Button>
    </form>
  );
}
