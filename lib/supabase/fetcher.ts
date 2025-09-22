export async function restSupabaseFetcher(
  schema: string,
  method: string,
  path: string,
  token: string,
  body?: object,
) {
  const response = await fetch(
    new URL(`/rest/v1${path}`, process.env.NEXT_PUBLIC_SUPABASE_URL).href,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept-Profile": schema,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    },
  );

  const data = await response.json();

  if (data.code) {
    throw new Error(data.message || "Unknown error");
  }

  return data;
}
