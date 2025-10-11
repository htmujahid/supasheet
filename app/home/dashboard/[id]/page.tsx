import { notFound } from "next/navigation";

import { Dashboard1 } from "@/features/dashboard/components/dashboard-1";
import { Dashboard2 } from "@/features/dashboard/components/dashboard-2";
import { Dashboard3 } from "@/features/dashboard/components/dashboard-3";
import { DashboardWidgets } from "@/features/dashboard/components/dashboard-widgets";
import { loadDashboardWidgets } from "@/features/dashboard/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

async function DashboardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const widgets = await loadDashboardWidgets(id);

  if (widgets && widgets.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
      {widgets?.map((widget) => (
        <DashboardWidgets key={widget.id} widget={widget} />
      ))}
    </div>
  );

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

export default withI18n(DashboardPage);
