"use client";

import { useCallback, useState } from "react";

import type { Factor } from "@supabase/supabase-js";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { If } from "@/components/makerkit/if";
import { Spinner } from "@/components/makerkit/spinner";
import { Trans } from "@/components/makerkit/trans";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetchAuthFactors } from "@/lib/supabase/hooks/use-fetch-mfa-factors";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";
import { useFactorsMutationKey } from "@/lib/supabase/hooks/use-user-factors-mutation-key";

import { MultiFactorAuthSetupDialog } from "./multi-factor-auth-setup-dialog";

export function MultiFactorAuthFactorsList(props: { userId: string }) {
  return (
    <div className={"flex flex-col space-y-4"}>
      <FactorsTableContainer userId={props.userId} />

      <div>
        <MultiFactorAuthSetupDialog userId={props.userId} />
      </div>
    </div>
  );
}

function FactorsTableContainer(props: { userId: string }) {
  const {
    data: factors,
    isLoading,
    isError,
  } = useFetchAuthFactors(props.userId);

  if (isLoading) {
    return (
      <div className={"flex items-center space-x-4"}>
        <Spinner />

        <div>
          <Trans i18nKey={"account:loadingFactors"} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert variant={"destructive"}>
          <AlertCircleIcon className={"h-4"} />

          <AlertTitle>
            <Trans i18nKey={"account:factorsListError"} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={"account:factorsListErrorDescription"} />
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allFactors = factors?.all ?? [];

  if (!allFactors.length) {
    return (
      <div className={"flex flex-col space-y-4"}>
        <Alert>
          <ShieldCheck className={"h-4"} />

          <AlertTitle>
            <Trans i18nKey={"account:multiFactorAuthHeading"} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={"account:multiFactorAuthDescription"} />
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <FactorsTable factors={allFactors} userId={props.userId} />;
}

function ConfirmUnenrollFactorModal(
  props: React.PropsWithChildren<{
    factorId: string;
    userId: string;
    setIsModalOpen: (isOpen: boolean) => void;
  }>,
) {
  const { t } = useTranslation();
  const unEnroll = useUnenrollFactor(props.userId);

  const onUnenrollRequested = useCallback(
    (factorId: string) => {
      if (unEnroll.isPending) return;

      const promise = unEnroll.mutateAsync(factorId).then((response) => {
        props.setIsModalOpen(false);

        if (!response.success) {
          const errorCode = response.data;

          throw t(`auth:errors.${errorCode}`, {
            defaultValue: t(`account:unenrollFactorError`),
          });
        }
      });

      toast.promise(promise, {
        loading: t(`account:unenrollingFactor`),
        success: t(`account:unenrollFactorSuccess`),
        error: (error: string) => {
          return error;
        },
      });
    },
    [props, t, unEnroll],
  );

  return (
    <AlertDialog open={!!props.factorId} onOpenChange={props.setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey={"account:unenrollFactorModalHeading"} />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans i18nKey={"account:unenrollFactorModalDescription"} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey={"common:cancel"} />
          </AlertDialogCancel>

          <AlertDialogAction
            type={"button"}
            disabled={unEnroll.isPending}
            onClick={() => onUnenrollRequested(props.factorId)}
          >
            <Trans i18nKey={"account:unenrollFactorModalButtonLabel"} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FactorsTable({
  factors,
  userId,
}: React.PropsWithChildren<{
  factors: Factor[];
  userId: string;
}>) {
  const [unEnrolling, setUnenrolling] = useState<string>();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Trans i18nKey={"account:factorName"} />
            </TableHead>
            <TableHead>
              <Trans i18nKey={"account:factorType"} />
            </TableHead>
            <TableHead>
              <Trans i18nKey={"account:factorStatus"} />
            </TableHead>

            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {factors.map((factor) => (
            <TableRow key={factor.id}>
              <TableCell>
                <span className={"block truncate"}>{factor.friendly_name}</span>
              </TableCell>

              <TableCell>
                <Badge variant={"info"} className={"inline-flex uppercase"}>
                  {factor.factor_type}
                </Badge>
              </TableCell>

              <td>
                <Badge
                  className={"inline-flex capitalize"}
                  variant={factor.status === "verified" ? "success" : "outline"}
                >
                  {factor.status}
                </Badge>
              </td>

              <td className={"flex justify-end"}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => setUnenrolling(factor.id)}
                      >
                        <X className={"h-4"} />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <Trans i18nKey={"account:unenrollTooltip"} />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <If condition={unEnrolling}>
        {(factorId) => (
          <ConfirmUnenrollFactorModal
            userId={userId}
            factorId={factorId}
            setIsModalOpen={() => setUnenrolling(undefined)}
          />
        )}
      </If>
    </>
  );
}

function useUnenrollFactor(userId: string) {
  const queryClient = useQueryClient();
  const client = useSupabase();
  const mutationKey = useFactorsMutationKey(userId);

  const mutationFn = async (factorId: string) => {
    const { data, error } = await client.auth.mfa.unenroll({
      factorId,
    });

    if (error) {
      return {
        success: false as const,
        data: error.code as string,
      };
    }

    return {
      success: true as const,
      data,
    };
  };

  return useMutation({
    mutationFn,
    mutationKey,
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: mutationKey,
      });
    },
  });
}
