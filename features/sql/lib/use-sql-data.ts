import { useCallback } from "react";

import { processSql, renderHttp } from "@supabase/sql-to-rest";
import { toast } from "sonner";

import { useSupabase } from "@/lib/supabase/hooks/use-supabase";
import { restSupabaseFetcher } from "@/lib/supabase/fetcher";

import { useSqlContext } from "../components/sql-context";

export function useSqlData() {
  const client = useSupabase();
  const { setIsLoading, setData } = useSqlContext();

  const fetchData = useCallback(
    async (sql: string) => {
      try {
        const result = await processSql(sql);
        const http = await renderHttp(result);

        setIsLoading(true);

        const token = await client.auth.getSession();

        const data = await restSupabaseFetcher(
          http.method,
          http.fullPath,
          token.data.session?.access_token || ""
        );

        setData(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(error?.toString());
        }
      }
    },
    [client, setIsLoading, setData],
  );

  return fetchData;
}
