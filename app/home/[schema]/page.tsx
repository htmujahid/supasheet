import { permanentRedirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ schema: string }>;
}) {
  const { schema } = await params;
  return permanentRedirect(`/home/${schema}/dashboard`);
}
