import { useCallback } from "react";

import { useParams } from "next/navigation";

import { processSql, renderHttp } from "@supabase/sql-to-rest";
import { toast } from "sonner";

import { restSupabaseFetcher } from "@/lib/supabase/fetcher";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import { useSqlContext } from "../../components/sql-context";

export function useSqlData() {
  const client = useSupabase();
  const { schema } = useParams<{ schema: string }>();
  const { setIsLoading, setData } = useSqlContext();

  const fetchData = useCallback(
    async (sql: string) => {
      try {
        const result = await processSql(sql);
        const http = await renderHttp(result);

        setIsLoading(true);

        const token = await client.auth.getSession();

        const data = await restSupabaseFetcher(
          schema,
          http.method,
          http.fullPath,
          token.data.session?.access_token || "",
        );

        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(error?.toString());
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, setIsLoading, setData],
  );

  return fetchData;
}
