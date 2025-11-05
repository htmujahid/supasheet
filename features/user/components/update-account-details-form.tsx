import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Database } from "@/lib/database.types";

import { useUpdateAccountData } from "../lib/hooks/use-update-account";
import { AccountDetailsSchema } from "../lib/schema/account-details.schema";

type UpdateUserDataParams =
  Database["supasheet"]["Tables"]["accounts"]["Update"];

export function UpdateAccountDetailsForm({
  displayName,
  onUpdate,
  userId,
}: {
  displayName: string;
  userId: string;
  onUpdate: (user: Partial<UpdateUserDataParams>) => void;
}) {
  const updateAccountMutation = useUpdateAccountData(userId);

  const form = useForm({
    resolver: zodResolver(AccountDetailsSchema),
    defaultValues: {
      displayName,
    },
  });

  const onSubmit = ({ displayName }: { displayName: string }) => {
    const data = { name: displayName };

    const promise = updateAccountMutation.mutateAsync(data).then(() => {
      onUpdate(data);
    });

    return toast.promise(() => promise, {
      success: "Profile successfully updated",
      error: "Encountered an error. Please try again",
      loading: "Updating profile...",
    });
  };

  return (
    <div className={"flex flex-col space-y-8"}>
      <Form {...form}>
        <form
          data-test={"update-account-name-form"}
          className={"flex flex-col space-y-4"}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name={"displayName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>

                <FormControl>
                  <Input
                    data-test={"account-display-name"}
                    minLength={2}
                    placeholder={""}
                    maxLength={100}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={updateAccountMutation.isPending}>
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
