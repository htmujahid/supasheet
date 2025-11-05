"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { StorageFile } from "../types";
import { StorageBreadcrumb } from "./storage-breadcrumb";
import { StorageList } from "./storage-list";
import { StorageToolbar } from "./storage-toolbar";

type StorageExplorerProps = {
  bucketId: string;
  files: StorageFile[];
  currentPath: string;
};

export function StorageExplorer({
  bucketId,
  files,
  currentPath,
}: StorageExplorerProps) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (path: string) => {
    const searchParams = new URLSearchParams();
    if (path) searchParams.set("path", path);
    router.push(
      `/home/storage/${bucketId}${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
    );
    setSelectedFiles(new Set());
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col gap-y-2">
      <StorageToolbar
        selectedFiles={selectedFiles}
        bucketId={bucketId}
        currentPath={currentPath}
        onSearchChange={setSearchQuery}
        onSelectionChange={setSelectedFiles}
      />

      <div className="h-full space-y-2 rounded-md border">
        <StorageBreadcrumb
          bucketName={bucketId}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />

        <div className="flex-1 overflow-auto">
          <StorageList
            files={filteredFiles}
            selectedFiles={selectedFiles}
            onFileSelect={toggleFileSelection}
            onFileOpen={(file) => {
              if (file.isFolder) {
                handleNavigate(file.path || file.name);
              }
              // File details are now handled internally by StorageList
            }}
            bucketId={bucketId}
            currentPath={currentPath}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}
