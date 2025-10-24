"use client";

import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttTimeline,
  GanttToday,
} from "@/components/ui/gantt";
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { GanttViewData } from "../lib/types";

const exampleFeatures = [
  { id: "feature-1", title: "User authentication system", start_at: new Date("2025-09-15"), end_at: new Date("2025-11-10"), },
  { id: "feature-2", title: "Real-time notifications", start_at: new Date("2025-10-01"), end_at: new Date("2025-12-15") },
  { id: "feature-3", title: "Advanced search filters", start_at: new Date("2025-08-20"), end_at: new Date("2025-10-30") },
  { id: "feature-4", title: "Payment gateway integration", start_at: new Date("2025-10-15"), end_at: new Date("2026-01-20") },
  { id: "feature-5", title: "Mobile responsive design", start_at: new Date("2025-09-01"), end_at: new Date("2025-11-25") },
  { id: "feature-6", title: "Data export functionality", start_at: new Date("2025-07-10"), end_at: new Date("2025-10-05") },
  { id: "feature-7", title: "API rate limiting", start_at: new Date("2025-10-20"), end_at: new Date("2025-12-30") },
  { id: "feature-8", title: "Dashboard widgets", start_at: new Date("2025-09-10"), end_at: new Date("2025-11-15") },
  { id: "feature-9", title: "Multi-language support", start_at: new Date("2025-11-01"), end_at: new Date("2026-02-10") },
  { id: "feature-10", title: "Performance monitoring", start_at: new Date("2025-08-15"), end_at: new Date("2025-10-20") },
  { id: "feature-11", title: "User profile customization", start_at: new Date("2025-10-05"), end_at: new Date("2025-12-01") },
  { id: "feature-12", title: "Automated testing suite", start_at: new Date("2025-09-20"), end_at: new Date("2025-11-30") },
  { id: "feature-13", title: "Social media integration", start_at: new Date("2025-11-10"), end_at: new Date("2026-01-25") },
  { id: "feature-14", title: "Activity logs", start_at: new Date("2025-07-25"), end_at: new Date("2025-10-10") },
  { id: "feature-15", title: "Email templates", start_at: new Date("2025-10-12"), end_at: new Date("2025-12-20") },
  { id: "feature-16", title: "Cloud backup system", start_at: new Date("2025-08-01"), end_at: new Date("2025-11-05") },
  { id: "feature-17", title: "Accessibility improvements", start_at: new Date("2025-09-25"), end_at: new Date("2025-12-10") },
  { id: "feature-18", title: "Third-party integrations", start_at: new Date("2025-11-15"), end_at: new Date("2026-03-01") },
  { id: "feature-19", title: "Advanced analytics", start_at: new Date("2025-08-10"), end_at: new Date("2025-10-25") },
  { id: "feature-20", title: "Team collaboration tools", start_at: new Date("2025-10-18"), end_at: new Date("2026-01-15") },
];

export function ResourceGanttView({
  features
}: {
  features: GanttViewData[];
}) {

  const handleViewFeature = (id: string) =>
    console.log(`Feature selected: ${id}`);

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>{}

  const handleMoveFeature = (id: string, startAt: Date, end_at: Date | null) => {
    if (!end_at) {
      return;
    }

    console.log(`Move feature: ${id} from ${startAt} to ${end_at}`);
  };

  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  return (
    <GanttProvider
      className="border"
      onAddItem={handleAddFeature}
      range="monthly"
      zoom={100}
    >
      <GanttTimeline className="h-[calc(100vh-85px)] overflow-y-auto">
        <GanttHeader />
        <GanttFeatureList className="h-[calc(100vh-145px)]">
            <GanttFeatureListGroup>
              {features.map((feature) => (
                <div className="flex" key={Object.values(feature.pk).join("/")}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        onClick={() => handleViewFeature(Object.values(feature.pk).join("/"))}
                        type="button"
                      >
                        <GanttFeatureItem
                          onMove={handleMoveFeature}
                          id={Object.values(feature.pk).join("/")}
                          title={feature.title}
                          startAt={new Date(feature.start_date)}
                          endAt={new Date(feature.end_date)}
                        >
                          <p className="flex-1 truncate text-xs">
                            {feature.title}
                          </p>
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewFeature(Object.values(feature.pk).join("/"))}
                      >
                        <EyeIcon className="text-muted-foreground" size={16} />
                        View feature
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(Object.values(feature.pk).join("/"))}
                      >
                        <LinkIcon className="text-muted-foreground" size={16} />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveFeature(Object.values(feature.pk).join("/"))}
                      >
                        <TrashIcon size={16} />
                        Remove from roadmap
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </GanttProvider>
  );
};
