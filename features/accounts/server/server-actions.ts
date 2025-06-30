'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { enhanceAction } from '@/lib/next/actions';
import { getLogger } from '@/lib/logger';
import { getSupabaseServerAdminClient } from '@/lib/supabase/clients/server-admin-client';
import { getSupabaseServerClient } from '@/lib/supabase/clients/server-client';

import { DeletePersonalAccountSchema } from '../schema/delete-personal-account.schema';
import { createDeletePersonalAccountService } from './services/delete-personal-account.service';

const enableAccountDeletion =
  process.env.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION === 'true';

export async function refreshAuthSession() {
  const client = await getSupabaseServerClient();

  await client.auth.refreshSession();

  return {};
}

export const deletePersonalAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    // validate the form data
    const { success } = DeletePersonalAccountSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!success) {
      throw new Error('Invalid form data');
    }

    const ctx = {
      name: 'account.delete',
      userId: user.id,
    };

    if (!enableAccountDeletion) {
      logger.warn(ctx, `Account deletion is not enabled`);

      throw new Error('Account deletion is not enabled');
    }

    logger.info(ctx, `Deleting account...`);

    const client = await getSupabaseServerClient();

    // create a new instance of the personal accounts service
    const service = createDeletePersonalAccountService();

    // sign out the user before deleting their account
    await client.auth.signOut();

    // delete the user's account and cancel all subscriptions
    await service.deletePersonalAccount({
      adminClient: getSupabaseServerAdminClient(),
      userId: user.id,
      userEmail: user.email ?? null,
    });

    logger.info(ctx, `Account request successfully sent`);

    // clear the cache for all pages
    revalidatePath('/', 'layout');

    // redirect to the home page
    redirect('/');
  },
  {},
);
