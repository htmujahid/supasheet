"use client";

import { useTransition } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

import { unbanAccountAction } from "../../lib/server/server-actions";

type UnbanAccountButtonProps = {
  user: User;
  disabled?: boolean;
};

export function UnbanAccountButton({ user, disabled }: UnbanAccountButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUnban = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("accountId", user.id);

        await toast.promise(unbanAccountAction(formData), {
          loading: "Unbanning account...",
          success: "Account unbanned successfully",
          error: (err) => err.message || "Failed to unban account",
        });
      } catch (error) {
        console.error("Error unbanning account:", error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUnban}
      disabled={disabled || isPending}
    >
      <UserCheck className="mr-2 h-4 w-4" />
      Unban
    </Button>
  );
}
