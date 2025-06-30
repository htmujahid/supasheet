import { useMemo } from 'react';

import { Database } from '../../database.types';
import { getSupabaseBrowserClient } from '../clients/browser-client';

/**
 * @name useSupabase
 * @description Use Supabase in a React component
 */
export function useSupabase<Db = Database>() {
  return useMemo(() => getSupabaseBrowserClient<Db>(), []);
}
