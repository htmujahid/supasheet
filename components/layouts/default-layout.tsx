import { getSupabaseServerClient } from '@/lib/supabase/clients/server-client';
import { requireUser } from '@/lib/supabase/require-user';

import { SidebarProvider } from '../ui/sidebar';
import { SiteHeader } from './site-header';

export async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const client = await getSupabaseServerClient();
  const data = await requireUser(client);

  return (
    <SidebarProvider
      className="flex flex-col"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 14)',
        } as React.CSSProperties
      }
    >
      <SiteHeader user={data.data} />
      <div className="flex flex-1">{children}</div>
    </SidebarProvider>
  );
}
