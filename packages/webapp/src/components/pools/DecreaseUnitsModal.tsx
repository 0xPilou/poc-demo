"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pool } from "@/lib/types";
import { useDecreaseUnits } from "@/hooks/useDecreaseUnits";

// Form schema validation
const formSchema = z.object({
  units: z.string().min(1, {
    message: "Units are required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface DecreaseUnitsModalProps {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
}

export function DecreaseUnitsModal({
  pool,
  isOpen,
  onClose,
}: DecreaseUnitsModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom hook for decreasing units
  const {
    decreaseUnits,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
  } = useDecreaseUnits();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: "",
    },
  });

  // Set max units to the user's current units
  useEffect(() => {
    if (pool.userUnits) {
      form.setValue("units", pool.userUnits);
    }
  }, [pool.userUnits, form]);

  // Handle form submission
  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await decreaseUnits({
        poolId: pool.id,
      });

      // Show toast for pending transaction
      toast({
        title: "Decreasing units...",
        description: "Your transaction is being processed.",
      });
    } catch (err) {
      console.error("Error decreasing units:", err);

      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decrease units. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      form.reset();
      onClose();

      // Show success toast
      toast({
        title: "Units decreased!",
        description: "You have successfully decreased your units in the pool.",
      });
    }
  }, [isConfirmed, form, onClose, toast]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Decrease Units</DialogTitle>
          <DialogDescription>
            Decrease your units in {pool.name}. This will reduce your rewards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="units">Number of Units</Label>
              <span className="text-sm text-muted-foreground">
                Max: {pool.userUnits || "0"}
              </span>
            </div>
            <Input
              id="units"
              type="number"
              placeholder="0"
              min="1"
              max={pool.userUnits}
              {...form.register("units")}
            />
            {form.formState.errors.units && (
              <p className="text-sm text-red-500">
                {form.formState.errors.units.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Decreasing units will reduce your share of the pool's rewards. You
              can decrease up to your current number of units.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isPending || isConfirming}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || isPending || isConfirming}
            >
              {isPending || isConfirming ? "Processing..." : "Decrease Units"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
