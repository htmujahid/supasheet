import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/lib/database.types';

/**
 * Class representing an API for interacting with user accounts.
 * @constructor
 * @param {SupabaseClient<Database>} client - The Supabase client instance.
 */
class AccountsApi {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name getAccount
   * @description Get the account data for the given ID.
   * @param id
   */
  async getAccount(id: string) {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

export function createAccountsApi(client: SupabaseClient<Database>) {
  return new AccountsApi(client);
}
