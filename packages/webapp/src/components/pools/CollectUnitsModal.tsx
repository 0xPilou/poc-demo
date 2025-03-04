"use client";

import { useState } from "react";
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
import { useCollectUnits } from "@/hooks/useCollectUnits";

// Form schema validation
const formSchema = z.object({
  units: z.string().min(1, {
    message: "Units are required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectUnitsModalProps {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
}

export function CollectUnitsModal({
  pool,
  isOpen,
  onClose,
}: CollectUnitsModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom hook for collecting units
  const { collectUnits, isPending, isConfirming, isConfirmed, isError, error } =
    useCollectUnits();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: "",
    },
  });

  // Handle form submission
  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await collectUnits({
        poolId: pool.id,
      });

      // Show toast for pending transaction
      toast({
        title: "Collecting units...",
        description: "Your transaction is being processed.",
      });

      // Close modal on success
      if (isConfirmed) {
        form.reset();
        onClose();

        // Show success toast
        toast({
          title: "Units collected!",
          description: "You have successfully collected units from the pool.",
        });
      }
    } catch (err) {
      console.error("Error collecting units:", err);

      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to collect units. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle transaction error
  if (isError && error) {
    toast({
      variant: "destructive",
      title: "Transaction failed",
      description: error.message || "Something went wrong. Please try again.",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collect Units</DialogTitle>
          <DialogDescription>
            Collect units from {pool.name} to start earning rewards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="units">Number of Units</Label>
            <Input
              id="units"
              type="number"
              placeholder="0"
              min="1"
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
              Collecting units allows you to receive a portion of the pool's
              rewards. The more units you collect, the more rewards you'll
              receive.
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
              disabled={isSubmitting || isPending || isConfirming}
            >
              {isPending || isConfirming ? "Processing..." : "Collect Units"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
