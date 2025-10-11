import { ImageIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type FileFieldEmptyStateProps = {
  maxFiles: number;
  maxSizeMB: number;
  onSelectFiles: () => void;
};

export function FileFieldEmptyState({
  maxFiles,
  maxSizeMB,
  onSelectFiles,
}: FileFieldEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
      <div
        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
        aria-hidden="true"
      >
        <ImageIcon className="size-4 opacity-60" />
      </div>
      <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
      <p className="text-muted-foreground text-xs">
        Max {maxFiles} file{maxFiles > 1 ? "s" : ""} ∙ Up to {maxSizeMB}MB
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onSelectFiles}
      >
        <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
        Select file{maxFiles > 1 ? "s" : ""}
      </Button>
    </div>
  );
}
