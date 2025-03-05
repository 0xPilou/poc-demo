import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDemoGDAContract } from "@/hooks/use-demo-gda-contract";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, HelpCircle } from "lucide-react";
import { Label } from "../ui/label";

export function CreatePoolForm() {
  const { address } = useAccount();
  const [showSuccess, setShowSuccess] = useState(false);

  // Contract hooks
  const { createPool, isCreatePoolLoading, isCreatePoolSuccess } =
    useDemoGDAContract();
  const { toast } = useToast();

  // Form schema
  const formSchema = z.object({
    name: z.string().min(1, "Pool name is required"),
    symbol: z.string().min(1, "Pool symbol is required"),
  });

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
    },
  });

  // Show success message when pool creation is successful
  useEffect(() => {
    if (isCreatePoolSuccess) {
      setShowSuccess(true);
      toast({
        title: "Success",
        description: "Your pool has been created successfully!",
      });
      form.reset();

      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCreatePoolSuccess, toast, form]);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!address) return;
    createPool(values.name, values.symbol);
  };

  if (!address) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please connect your wallet to create a pool.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Pool</CardTitle>
          <CardDescription>
            Create a new distribution pool to manage token rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Connected wallet status */}
          <div className="mb-4 p-2 bg-muted rounded-md">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not connected"}
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your pool has been created successfully!
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="name" className="flex items-center">
                        Pool Name <HelpCircle className="ml-1 h-3 w-3" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>A descriptive name for your distribution pool</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="name"
                placeholder="Enter pool name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="symbol" className="flex items-center">
                        Pool Symbol <HelpCircle className="ml-1 h-3 w-3" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        A short symbol to identify your pool (e.g. "DEV" for
                        Developer Rewards)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="symbol"
                placeholder="Enter pool symbol"
                {...form.register("symbol")}
              />
              {form.formState.errors.symbol && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.symbol.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isCreatePoolLoading}
            >
              {isCreatePoolLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Pool...
                </>
              ) : (
                "Create Pool"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
