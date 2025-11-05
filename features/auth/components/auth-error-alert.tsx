import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * @name AuthErrorAlert
 * @param error This error comes from Supabase as the code returned on errors
 * This error is mapped from the translation auth:errors.{error}
 * To update the error messages, please update the translation file
 * https://github.com/supabase/gotrue-js/blob/master/src/lib/errors.ts
 * @constructor
 */
export function AuthErrorAlert({
  error,
}: {
  error: Error | null | undefined | string;
}) {
  if (!error) {
    return null;
  }

  const DefaultError =
    "We have encountered an error. Please ensure you have a working internet connection and try again";

  return (
    <Alert variant={"destructive"}>
      <AlertCircleIcon className={"w-4"} />

      <AlertTitle>Sorry, we weren&apos;t able to authenticate you</AlertTitle>

      <AlertDescription data-test={"auth-error-message"}>
        {DefaultError}
      </AlertDescription>
    </Alert>
  );
}
