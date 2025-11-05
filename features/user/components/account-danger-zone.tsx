"use client";

import { useFormStatus } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { deletePersonalAccountAction } from "../lib/actions";
import { DeletePersonalAccountSchema } from "../lib/schema/delete-personal-account.schema";

export function AccountDangerZone() {
  return (
    <div className={"flex flex-col space-y-4"}>
      <div className={"flex flex-col space-y-1"}>
        <span className={"text-sm font-medium"}>Delete your Account</span>

        <p className={"text-muted-foreground text-sm"}>
          This will delete your account and the accounts you own. Furthermore,
          we will immediately cancel any active subscriptions. This action
          cannot be undone.
        </p>
      </div>

      <div>
        <DeleteAccountModal />
      </div>
    </div>
  );
}

function DeleteAccountModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-test={"delete-account-button"} variant={"destructive"}>
          Delete your Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your Account</AlertDialogTitle>
        </AlertDialogHeader>

        <DeleteAccountForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteAccountForm() {
  const form = useForm({
    resolver: zodResolver(DeletePersonalAccountSchema),
    defaultValues: {
      confirmation: "" as "DELETE",
    },
  });

  return (
    <Form {...form}>
      <form
        data-test={"delete-account-form"}
        action={deletePersonalAccountAction}
        className={"flex flex-col space-y-4"}
      >
        <div className={"flex flex-col space-y-6"}>
          <div
            className={
              "border-destructive text-destructive rounded-md border p-4 text-sm"
            }
          >
            <div className={"flex flex-col space-y-2"}>
              <div>
                This will delete your account and the accounts you own.
                Furthermore, we will immediately cancel any active
                subscriptions. This action cannot be undone.
              </div>

              <div>Are you sure you want to continue?</div>
            </div>
          </div>

          <FormItem>
            <FormLabel>Type DELETE to confirm</FormLabel>

            <FormControl>
              <Input
                autoComplete={"off"}
                data-test={"delete-account-input-field"}
                required
                name={"confirmation"}
                type={"text"}
                className={"w-full"}
                placeholder={""}
                pattern={`DELETE`}
              />
            </FormControl>
          </FormItem>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <DeleteAccountSubmitButton />
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function DeleteAccountSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      data-test={"confirm-delete-account-button"}
      type={"submit"}
      disabled={pending}
      name={"action"}
      variant={"destructive"}
    >
      {pending ? "Deleting Account..." : "Delete your Account"}
    </Button>
  );
}
