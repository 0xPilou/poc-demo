"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { usePools } from "@/hooks/usePools";
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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Pool name must be at least 3 characters.",
  }),
  symbol: z
    .string()
    .min(1, {
      message: "Pool symbol is required.",
    })
    .max(10, {
      message: "Pool symbol must be at most 10 characters.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePoolForm() {
  const { createPool, isCreating } = usePools();
  const { toast } = useToast();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [poolAddress, setPoolAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
    },
  });

  // Function to estimate gas (placeholder for now)
  const estimateGas = async (data: FormValues) => {
    // In a real implementation, you would call a contract method to estimate gas
    // For now, we'll just simulate it
    setGasEstimate("~0.002 ETH");
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      setTransactionHash(null);
      setPoolAddress(null);

      // Call the createPool function from the usePools hook
      const hash = await createPool(data.name, data.symbol);
      setTransactionHash(hash);

      // In a real implementation, you would get the pool address from the transaction receipt
      // For now, we'll just simulate it with a placeholder
      // This would be replaced with actual pool address from transaction receipt
      setPoolAddress("0x" + Math.random().toString(16).substring(2, 42));

      // Reset the form
      form.reset();

      // Show success toast
      toast({
        title: "Pool created successfully!",
        description: `Your pool "${data.name}" has been created.`,
      });
    } catch (err) {
      console.error("Error creating pool:", err);
      setError(err instanceof Error ? err.message : "Failed to create pool");

      // Show error toast
      toast({
        variant: "destructive",
        title: "Failed to create pool",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  // Update gas estimate when form values change
  const handleFormChange = () => {
    const values = form.getValues();
    if (values.name && values.symbol) {
      estimateGas(values);
    } else {
      setGasEstimate(null);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={handleFormChange}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<FormValues, "name">;
            }) => (
              <FormItem>
                <FormLabel>Pool Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Community Pool" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for your pool.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({
              field,
            }: {
              field: ControllerRenderProps<FormValues, "symbol">;
            }) => (
              <FormItem>
                <FormLabel>Pool Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="MCP" {...field} />
                </FormControl>
                <FormDescription>
                  A short symbol for your pool (e.g. "MCP" for "My Community
                  Pool").
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

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Pool...
              </>
            ) : (
              "Create Pool"
            )}
          </Button>
        </form>
      </Form>

      {transactionHash && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">
            Transaction Successful
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-500">
            <div>Transaction Hash: {formatAddress(transactionHash)}</div>
            {poolAddress && (
              <div className="mt-1">
                Pool Address: {formatAddress(poolAddress)}
              </div>
            )}
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
