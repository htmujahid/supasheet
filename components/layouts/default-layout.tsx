import { getSupabaseServerClient } from '@/lib/supabase/clients/server-client';
import { requireUser } from '@/lib/supabase/require-user';

import { SiteHeader } from './site-header';

export async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const client = await getSupabaseServerClient();
  const data = await requireUser(client);

  return (
    <div className="flex flex-col">
      <SiteHeader user={data.data} />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
