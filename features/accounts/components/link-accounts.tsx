'use client';

import type { Provider, UserIdentity } from '@supabase/supabase-js';

import { CheckCircle } from 'lucide-react';

import { useLinkIdentityWithProvider } from '@/lib/supabase/hooks/use-link-identity-with-provider';
import { useUnlinkUserIdentity } from '@/lib/supabase/hooks/use-unlink-user-identity';
import { useUserIdentities } from '@/lib/supabase/hooks/use-user-identities';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { If } from '@/components/makerkit/if';
import { OauthProviderLogoImage } from '@/components/makerkit/oauth-provider-logo-image';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Spinner } from '@/components/makerkit/spinner';
import { Trans } from '@/components/makerkit/trans';

export function LinkAccountsList(props: { providers: Provider[] }) {
  const unlinkMutation = useUnlinkUserIdentity();
  const linkMutation = useLinkIdentityWithProvider();

  const {
    identities,
    hasMultipleIdentities,
    isProviderConnected,
    isLoading: isLoadingIdentities,
  } = useUserIdentities();

  // Only show providers from the allowed list that aren't already connected
  const availableProviders = props.providers.filter(
    (provider) => !isProviderConnected(provider),
  );

  // Show all connected identities, even if their provider isn't in the allowed providers list
  const connectedIdentities = identities;

  const handleUnlinkAccount = (identity: UserIdentity) => {
    const promise = unlinkMutation.mutateAsync(identity);

    toast.promise(promise, {
      loading: <Trans i18nKey={'account:unlinkingAccount'} />,
      success: <Trans i18nKey={'account:accountUnlinked'} />,
      error: <Trans i18nKey={'account:unlinkAccountError'} />,
    });
  };

  const handleLinkAccount = (provider: Provider) => {
    const promise = linkMutation.mutateAsync(provider);

    toast.promise(promise, {
      loading: <Trans i18nKey={'account:linkingAccount'} />,
      success: <Trans i18nKey={'account:accountLinked'} />,
      error: <Trans i18nKey={'account:linkAccountError'} />,
    });
  };

  if (isLoadingIdentities) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linked Accounts Section */}
      <If condition={connectedIdentities.length > 0}>
        <div className="space-y-3">
          <div>
            <h3 className="text-foreground text-sm font-medium">
              <Trans i18nKey={'account:linkedAccounts'} />
            </h3>

            <p className="text-muted-foreground text-xs">
              <Trans i18nKey={'account:alreadyLinkedAccountsDescription'} />
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            {connectedIdentities.map((identity) => (
              <div
                key={identity.id}
                className="bg-muted/50 flex h-14 items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <OauthProviderLogoImage providerId={identity.provider} />

                  <div className="flex flex-col">
                    <span className="flex items-center gap-x-2 text-sm font-medium capitalize">
                      <CheckCircle className="h-3 w-3 text-green-500" />

                      <span>{identity.provider}</span>
                    </span>

                    <If condition={identity.identity_data?.email}>
                      <span className="text-muted-foreground text-xs">
                        {identity.identity_data?.email as string}
                      </span>
                    </If>
                  </div>
                </div>

                <If condition={hasMultipleIdentities}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={unlinkMutation.isPending}
                      >
                        <If condition={unlinkMutation.isPending}>
                          <Spinner className="mr-2 h-3 w-3" />
                        </If>
                        <Trans i18nKey={'account:unlinkAccount'} />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          <Trans i18nKey={'account:confirmUnlinkAccount'} />
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          <Trans
                            i18nKey={'account:unlinkAccountConfirmation'}
                            values={{ provider: identity.provider }}
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <Trans i18nKey={'common:cancel'} />
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => handleUnlinkAccount(identity)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          <Trans i18nKey={'account:unlinkAccount'} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </If>
              </div>
            ))}
          </div>
        </div>
      </If>

      {/* Available Accounts Section */}
      <If condition={availableProviders.length > 0}>
        <Separator />

        <div className="space-y-3">
          <div>
            <h3 className="text-foreground text-sm font-medium">
              <Trans i18nKey={'account:availableAccounts'} />
            </h3>

            <p className="text-muted-foreground text-xs">
              <Trans i18nKey={'account:availableAccountsDescription'} />
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            {availableProviders.map((provider) => (
              <button
                key={provider}
                className="hover:bg-muted/50 flex h-14 items-center justify-between rounded-lg border p-3 transition-colors"
                onClick={() => handleLinkAccount(provider)}
              >
                <div className="flex items-center gap-3">
                  <OauthProviderLogoImage providerId={provider} />

                  <span className="text-sm font-medium capitalize">
                    {provider}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </If>

      <If
        condition={
          connectedIdentities.length === 0 && availableProviders.length === 0
        }
      >
        <div className="text-muted-foreground py-8 text-center">
          <Trans i18nKey={'account:noAccountsAvailable'} />
        </div>
      </If>
    </div>
  );
}