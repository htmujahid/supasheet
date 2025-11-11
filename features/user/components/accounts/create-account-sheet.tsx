"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

import { useCurrentUserRoles } from "../../lib/hooks/use-current-user-roles";
import { CreateAccountForm } from "./create-account-form";

type CreateAccountSheetProps = React.ComponentPropsWithRef<typeof Sheet> & {
  showTrigger?: boolean;
};

export function CreateAccountSheet({
  showTrigger = true,
  ...props
}: CreateAccountSheetProps) {
  const { data: userRoles, isLoading } = useCurrentUserRoles();
  const isMobile = useIsMobile();

  if (isLoading) {
    return null;
  }

  return (
    <Sheet {...props}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <Plus />
            Create Account
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-full w-full flex-col gap-6 overflow-hidden md:max-w-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Create Account</SheetTitle>
          <SheetDescription>
            Create a new account and assign roles
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <CreateAccountForm userRoles={userRoles || []} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
