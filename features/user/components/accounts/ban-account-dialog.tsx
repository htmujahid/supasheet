"use client";

import { useState, useTransition } from "react";
import { UserX } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@supabase/supabase-js";

import { banAccountAction } from "../../lib/server/server-actions";

type BanAccountDialogProps = {
  user: User;
  disabled?: boolean;
};

export function BanAccountDialog({ user, disabled }: BanAccountDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [banDurationType, setBanDurationType] = useState("permanent");
  const [customBanDuration, setCustomBanDuration] = useState("");

  const getBanDuration = () => {
    switch (banDurationType) {
      case "1h":
        return "1h";
      case "24h":
        return "24h";
      case "168h":
        return "168h";
      case "720h":
        return "720h";
      case "permanent":
        return "876000h";
      case "custom":
        return customBanDuration;
      default:
        return "876000h";
    }
  };

  const handleBan = () => {
    const duration = getBanDuration();

    if (banDurationType === "custom" && !customBanDuration.trim()) {
      toast.error("Please enter a custom ban duration");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("accountId", user.id);
        formData.append("duration", duration);

        await toast.promise(banAccountAction(formData), {
          loading: "Banning account...",
          success: "Account banned successfully",
          error: (err) => err.message || "Failed to ban account",
        });
        setIsOpen(false);
        // Reset form state
        setBanDurationType("permanent");
        setCustomBanDuration("");
      } catch (error) {
        console.error("Error banning account:", error);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <UserX className="mr-2 h-4 w-4" />
          Ban
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent <strong>{user.email || user.id}</strong> from
            signing in. You can unban them later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label className="text-sm font-medium">Ban Duration</Label>
          <RadioGroup
            value={banDurationType}
            onValueChange={setBanDurationType}
            className="mt-3 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1h" id="1h" />
              <Label htmlFor="1h" className="cursor-pointer font-normal">
                1 hour
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h" className="cursor-pointer font-normal">
                1 day (24 hours)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="168h" id="168h" />
              <Label htmlFor="168h" className="cursor-pointer font-normal">
                1 week (168 hours)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="720h" id="720h" />
              <Label htmlFor="720h" className="cursor-pointer font-normal">
                30 days (720 hours)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="permanent" id="permanent" />
              <Label htmlFor="permanent" className="cursor-pointer font-normal">
                Permanent (876000 hours)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer font-normal">
                Custom
              </Label>
            </div>
          </RadioGroup>
          {banDurationType === "custom" && (
            <div className="mt-3">
              <Input
                placeholder="e.g., 2h45m, 300ms, 7200s"
                value={customBanDuration}
                onChange={(e) => setCustomBanDuration(e.target.value)}
                className="mt-2"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Valid units: ns, us (µs), ms, s, m, h (e.g., 2h45m)
              </p>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBan}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Banning..." : "Ban Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
