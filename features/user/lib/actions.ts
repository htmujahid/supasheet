"use server";

import { revalidatePath } from "next/cache";

import { getLogger } from "@/lib/logger";
import { enhanceAction } from "@/lib/next/actions";
import { getSupabaseServerAdminClient } from "@/lib/supabase/clients/server-admin-client";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import { loadAccountPermissions } from "./loaders";
import { CreateAccountSchema } from "./schema/create-account.schema";
import { DeletePersonalAccountSchema } from "./schema/delete-personal-account.schema";
import { UpdateAccountSchema } from "./schema/update-account.schema";

const enableAccountDeletion =
  process.env.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION === "true";

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
      throw new Error("Invalid form data");
    }

    const ctx = {
      name: "account.delete",
      userId: user.id,
    };

    if (!enableAccountDeletion) {
      logger.warn(ctx, `Account deletion is not enabled`);

      throw new Error("Account deletion is not enabled");
    }

    logger.info(ctx, `Deleting account...`);

    const client = await getSupabaseServerClient();

    // sign out the user before deleting their account
    await client.auth.signOut();

    const adminClient = getSupabaseServerAdminClient();

    // delete the user's account and cancel all subscriptions
    try {
      await adminClient.auth.admin.deleteUser(user.id);
    } catch (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        "Encountered an error deleting user",
      );

      throw new Error("Error deleting user");
    }

    logger.info(ctx, `Account request successfully sent`);
  },
  {},
);

export const createAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    const ctx = {
      name: "account.create",
      userId: user.id,
    };

    // Check permissions
    const permissions = await loadAccountPermissions();

    if (!permissions.canInsert) {
      logger.warn(ctx, "User does not have permission to create accounts");
      throw new Error("You do not have permission to create accounts");
    }

    const data = Object.fromEntries(formData.entries());

    // Convert string values to appropriate types
    const parsedData = {
      id: data.id ? String(data.id) : undefined,
      email: data.email ? String(data.email) : undefined,
      password: data.password ? String(data.password) : undefined,
      email_confirm: data.email_confirm === "true",
      phone: data.phone ? String(data.phone) : undefined,
      phone_confirm: data.phone_confirm === "true",
      user_roles: data.user_roles ? JSON.parse(String(data.user_roles)) : [],
    };

    // Validate the form data
    const result = CreateAccountSchema.safeParse(parsedData);

    if (!result.success) {
      logger.error(
        { userId: user.id, errors: result.error.flatten() },
        "Invalid form data for account creation",
      );

      throw new Error(result.error.errors[0]?.message || "Invalid form data");
    }

    logger.info(ctx, "Creating new account...");

    const adminClient = getSupabaseServerAdminClient();

    const createAccountParams: {
      email?: string;
      password?: string;
      phone?: string;
      email_confirm?: boolean;
      phone_confirm?: boolean;
      user_metadata?: Record<string, unknown>;
    } = {};

    if (result.data.email) {
      createAccountParams.email = result.data.email;
      createAccountParams.email_confirm = result.data.email_confirm;
    }

    if (result.data.phone) {
      createAccountParams.phone = result.data.phone;
      createAccountParams.phone_confirm = result.data.phone_confirm;
    }

    if (result.data.password) {
      createAccountParams.password = result.data.password;
    }

    // Create the account
    const { data: newAccount, error } =
      await adminClient.auth.admin.createUser(createAccountParams);

    if (error) {
      logger.error({ ...ctx, error }, "Failed to create account");
      throw new Error(error.message || "Failed to create account");
    }

    logger.info(
      { ...ctx, newAccountId: newAccount.user.id },
      "Account created successfully",
    );

    // Insert user roles if provided
    if (result.data.user_roles && result.data.user_roles.length > 0) {
      const client = await getSupabaseServerClient();

      const userRolesToInsert = result.data.user_roles.map((role) => ({
        account_id: newAccount.user.id,
        role: role as "user" | "x-admin",
      }));

      const { error: rolesError } = await client
        .schema("supasheet")
        .from("user_roles")
        .insert(userRolesToInsert);

      if (rolesError) {
        logger.error(
          { ...ctx, error: rolesError, newAccountId: newAccount.user.id },
          "Failed to insert user roles",
        );
        throw new Error(
          rolesError.message || "Failed to assign roles to account",
        );
      }

      logger.info(
        { ...ctx, newAccountId: newAccount.user.id, roles: result.data.user_roles },
        "User roles assigned successfully",
      );
    }

    // Revalidate the accounts page
    revalidatePath("/home/user/accounts");
  },
  {},
);

export const updateAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    const data = Object.fromEntries(formData.entries());
    const accountId = data.accountId as string;

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const ctx = {
      name: "account.update",
      userId: user.id,
      targetAccountId: accountId,
    };

    // Check permissions
    const permissions = await loadAccountPermissions();

    if (!permissions.canUpdate) {
      logger.warn(ctx, "User does not have permission to update accounts");
      throw new Error("You do not have permission to update accounts");
    }

    // Convert string values to appropriate types
    const parsedData = {
      email: data.email ? String(data.email) : undefined,
      email_confirm: data.email_confirm === "true",
      phone: data.phone ? String(data.phone) : undefined,
      phone_confirm: data.phone_confirm === "true",
      password: data.password ? String(data.password) : undefined,
      user_roles: data.user_roles ? JSON.parse(String(data.user_roles)) : undefined,
    };

    // Validate the form data
    const result = UpdateAccountSchema.safeParse(parsedData);

    if (!result.success) {
      logger.error(
        { userId: user.id, errors: result.error.flatten() },
        "Invalid form data for account update",
      );

      throw new Error(result.error.errors[0]?.message || "Invalid form data");
    }

    logger.info(ctx, "Updating account...");

    const adminClient = getSupabaseServerAdminClient();

    const updateAccountParams: {
      email?: string;
      password?: string;
      phone?: string;
      email_confirm?: boolean;
      phone_confirm?: boolean;
    } = {};

    if (result.data.email) {
      updateAccountParams.email = result.data.email;
      if (result.data.email_confirm !== undefined) {
        updateAccountParams.email_confirm = result.data.email_confirm;
      }
    }

    if (result.data.phone) {
      updateAccountParams.phone = result.data.phone;
      if (result.data.phone_confirm !== undefined) {
        updateAccountParams.phone_confirm = result.data.phone_confirm;
      }
    }

    if (result.data.password) {
      updateAccountParams.password = result.data.password;
    }

    // Update the account
    const { data: updatedAccount, error } =
      await adminClient.auth.admin.updateUserById(
        accountId,
        updateAccountParams,
      );

    if (error) {
      logger.error({ ...ctx, error }, "Failed to update account");
      throw new Error(error.message || "Failed to update account");
    }

    logger.info(
      { ...ctx, updatedAccountId: updatedAccount.user.id },
      "Account updated successfully",
    );

    // Update user roles if provided
    if (result.data.user_roles !== undefined) {
      const client = await getSupabaseServerClient();

      // Delete existing roles for this account
      const { error: deleteError } = await client
        .schema("supasheet")
        .from("user_roles")
        .delete()
        .eq("account_id", accountId);

      if (deleteError) {
        logger.error(
          { ...ctx, error: deleteError },
          "Failed to delete existing user roles",
        );
        throw new Error(
          deleteError.message || "Failed to update user roles",
        );
      }

      // Insert new roles if any
      if (result.data.user_roles.length > 0) {
        const userRolesToInsert = result.data.user_roles.map((role) => ({
          account_id: accountId,
          role: role as "user" | "x-admin",
        }));

        const { error: insertError } = await client
          .schema("supasheet")
          .from("user_roles")
          .insert(userRolesToInsert);

        if (insertError) {
          logger.error(
            { ...ctx, error: insertError },
            "Failed to insert user roles",
          );
          throw new Error(
            insertError.message || "Failed to update user roles",
          );
        }
      }

      logger.info(
        { ...ctx, roles: result.data.user_roles },
        "User roles updated successfully",
      );
    }

    // Revalidate the accounts page and detail page
    revalidatePath("/home/user/accounts");
    revalidatePath(`/home/user/accounts/${accountId}`);
  },
  {},
);

export const deleteAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    const data = Object.fromEntries(formData.entries());
    const accountId = data.accountId as string;

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const ctx = {
      name: "account.delete",
      userId: user.id,
      targetAccountId: accountId,
    };

    // Check permissions
    const permissions = await loadAccountPermissions();

    if (!permissions.canDelete) {
      logger.warn(ctx, "User does not have permission to delete accounts");
      throw new Error("You do not have permission to delete accounts");
    }

    logger.info(ctx, "Deleting account...");

    const adminClient = getSupabaseServerAdminClient();

    // Delete the account
    const { error } = await adminClient.auth.admin.deleteUser(accountId);

    if (error) {
      logger.error({ ...ctx, error }, "Failed to delete account");
      throw new Error(error.message || "Failed to delete account");
    }

    logger.info({ ...ctx }, "Account deleted successfully");

    // Revalidate the accounts page
    revalidatePath("/home/user/accounts");

    return { success: true };
  },
  {},
);

export const banAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    const data = Object.fromEntries(formData.entries());
    const accountId = data.accountId as string;
    const duration = data.duration as string;

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const ctx = {
      name: "account.ban",
      userId: user.id,
      targetAccountId: accountId,
      duration,
    };

    // Check permissions
    const permissions = await loadAccountPermissions();

    if (!permissions.canUpdate) {
      logger.warn(ctx, "User does not have permission to ban accounts");
      throw new Error("You do not have permission to ban accounts");
    }

    logger.info(ctx, "Banning account...");

    const adminClient = getSupabaseServerAdminClient();

    // Ban the account
    const { error } = await adminClient.auth.admin.updateUserById(accountId, {
      ban_duration: duration || "876000h", // Default to 100 years if not specified
    });

    if (error) {
      logger.error({ ...ctx, error }, "Failed to ban account");
      throw new Error(error.message || "Failed to ban account");
    }

    logger.info({ ...ctx }, "Account banned successfully");

    // Revalidate the accounts page
    revalidatePath("/home/user/accounts");
    revalidatePath(`/home/user/accounts/${accountId}`);

    return { success: true };
  },
  {},
);

export const unbanAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const logger = await getLogger();

    const data = Object.fromEntries(formData.entries());
    const accountId = data.accountId as string;

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const ctx = {
      name: "account.unban",
      userId: user.id,
      targetAccountId: accountId,
    };

    // Check permissions
    const permissions = await loadAccountPermissions();

    if (!permissions.canUpdate) {
      logger.warn(ctx, "User does not have permission to unban accounts");
      throw new Error("You do not have permission to unban accounts");
    }

    logger.info(ctx, "Unbanning account...");

    const adminClient = getSupabaseServerAdminClient();

    // Unban the account
    const { error } = await adminClient.auth.admin.updateUserById(accountId, {
      ban_duration: "none",
    });

    if (error) {
      logger.error({ ...ctx, error }, "Failed to unban account");
      throw new Error(error.message || "Failed to unban account");
    }

    logger.info({ ...ctx }, "Account unbanned successfully");

    // Revalidate the accounts page
    revalidatePath("/home/user/accounts");
    revalidatePath(`/home/user/accounts/${accountId}`);

    return { success: true };
  },
  {},
);
