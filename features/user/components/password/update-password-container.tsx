"use client";

import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/lib/supabase/hooks/use-user";

import { UpdatePasswordForm } from "./update-password-form";

export function UpdatePasswordFormContainer(
  props: React.PropsWithChildren<{
    callbackPath: string;
  }>,
) {
  const { data: user, isPending } = useUser();

  if (isPending) {
    return <LoadingOverlay fullPage={false} />;
  }

  if (!user) {
    return null;
  }

  const canUpdatePassword = user.identities?.some(
    (item) => item.provider === `email`,
  );

  if (!canUpdatePassword) {
    return <WarnCannotUpdatePasswordAlert />;
  }

  return <UpdatePasswordForm callbackPath={props.callbackPath} user={user} />;
}

function WarnCannotUpdatePasswordAlert() {
  return (
    <Alert variant={"warning"} className="">
      <AlertTitle>
        You cannot update your password because your account is not linked to an
        email.
      </AlertTitle>
    </Alert>
  );
}
