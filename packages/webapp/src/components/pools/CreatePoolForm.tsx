"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePool } from "@/hooks/useCreatePool";
import { useEffect } from "react";

// Form schema validation
const formSchema = z.object({
  poolName: z.string().min(3, {
    message: "Pool name must be at least 3 characters.",
  }),
  poolSymbol: z.string().min(1, {
    message: "Pool symbol must be at least 1 character.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePoolForm() {
  const router = useRouter();
  const { toast } = useToast();

  // Use the custom hook
  const {
    createPool,
    isSubmitting,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
  } = useCreatePool();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poolName: "",
      poolSymbol: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    await createPool(values);
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Pool created!",
        description: "Your pool has been created successfully.",
      });

      // Reset form and redirect
      form.reset();
      router.push(`/pools`);
    }
  }, [isConfirmed, toast, form, router]);

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
    <form
      id="create-pool-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="poolName">Pool Name</Label>
        <Input
          id="poolName"
          placeholder="Enter pool name"
          {...form.register("poolName")}
        />
        {form.formState.errors.poolName && (
          <p className="text-sm text-red-500">
            {form.formState.errors.poolName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="poolSymbol">Pool Symbol</Label>
        <Input
          id="poolSymbol"
          placeholder="Enter pool symbol (e.g., BTC, ETH)"
          {...form.register("poolSymbol")}
        />
        {form.formState.errors.poolSymbol && (
          <p className="text-sm text-red-500">
            {form.formState.errors.poolSymbol.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isConfirming || isSubmitting}
      >
        {isPending || isConfirming ? "Creating Pool..." : "Create Pool"}
      </Button>
    </form>
  );
}
