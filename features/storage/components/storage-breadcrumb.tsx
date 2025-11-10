"use client";

import { ChevronRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

type StorageBreadcrumbProps = {
  bucketName: string;
  currentPath: string;
  onNavigate: (path: string) => void;
};

export function StorageBreadcrumb({
  bucketName,
  currentPath,
  onNavigate,
}: StorageBreadcrumbProps) {
  const pathParts = currentPath ? currentPath.split("/").filter(Boolean) : [];

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b p-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate("")}
        className="h-7 gap-1 px-2 py-1"
      >
        <Home className="h-3 w-3" />
        {bucketName}
      </Button>

      {pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join("/");
        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="text-muted-foreground mx-1 h-3 w-3" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(path)}
              className="h-7 px-2 py-1"
            >
              {part}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
