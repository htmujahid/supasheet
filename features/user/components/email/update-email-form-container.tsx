"use client";

import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import { useUser } from "@/lib/supabase/hooks/use-user";

import { UpdateEmailForm } from "./update-email-form";

export function UpdateEmailFormContainer({
  callbackPath,
}: {
  callbackPath: string;
}) {
  const { data: user, isPending } = useUser();

  if (isPending) {
    return <LoadingOverlay fullPage={false} />;
  }

  if (!user) {
    return null;
  }

  return <UpdateEmailForm callbackPath={callbackPath} user={user} />;
}
