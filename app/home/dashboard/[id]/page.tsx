import { Dashboard1 } from "@/features/dashboard/components/dashboard-1";
import { Dashboard2 } from "@/features/dashboard/components/dashboard-2";
import { Dashboard3 } from "@/features/dashboard/components/dashboard-3";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  if (id === "dashboard-1") {
    return <Dashboard1 />;
  }
  if (id === "dashboard-2") {
    return <Dashboard2 />;
  }
  if (id === "dashboard-3") {
    return <Dashboard3 />;
  }
  return <Dashboard1 />;
}
