import { notFound } from "next/navigation";

import { DashboardWidgets } from "@/features/dashboard/components/dashboard-widgets";
import { loadDashboardWidgets } from "@/features/dashboard/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

async function DashboardPage({
  params,
}: {
  params: Promise<{
    group: string;
  }>;
}) {
  const { group } = await params;
  const widgets = await loadDashboardWidgets(group);

  if (widgets && widgets.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-2.5 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {widgets?.map((widget) => (
        <DashboardWidgets key={widget.id} widget={widget} />
      ))}
    </div>
  );
}

export default withI18n(DashboardPage);
