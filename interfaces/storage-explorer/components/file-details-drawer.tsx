"use client";

import { useState, useTransition } from "react";

import {
  ArchiveIcon,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";

import type { StorageFile } from "../types";

interface FileDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: StorageFile | null;
  bucketId: string;
}

export function FileDetailsDrawer({
  open,
  onOpenChange,
  file,
  bucketId,
}: FileDetailsDrawerProps) {
  const supabase = getSupabaseBrowserClient();
  const [copied, setCopied] = useState(false);
  const [isPendingCopy, startCopyTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();

  if (!file) return null;

  const getFileIcon = () => {
    const type = file.type?.toLowerCase() || "";
    const iconClass = "h-12 w-12";

    if (type.startsWith("image/"))
      return <ImageIcon className={`${iconClass} text-primary/80`} />;
    if (type.startsWith("video/"))
      return <VideoIcon className={`${iconClass} text-primary/70`} />;
    if (type.startsWith("audio/"))
      return <MusicIcon className={`${iconClass} text-primary/60`} />;
    if (type.includes("zip") || type.includes("tar"))
      return <ArchiveIcon className={`${iconClass} text-muted-foreground`} />;
    if (type.includes("text") || type.includes("document"))
      return <FileTextIcon className={`${iconClass} text-muted-foreground/80`} />;

    return <FileIcon className={`${iconClass} text-muted-foreground/60`} />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getFileUrl = async (): Promise<string> => {
    if (!file) return "";

    const filePath = file.path || file.name;

    // Try to get public URL first
    const { data: publicUrlData } = supabase.storage
      .from(bucketId)
      .getPublicUrl(filePath);

    // If bucket is public, return public URL
    if (publicUrlData?.publicUrl) {
      return publicUrlData.publicUrl;
    }

    // Otherwise, create a signed URL
    const { data, error } = await supabase.storage
      .from(bucketId)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) return "";
    return data?.signedUrl || "";
  };

  const handleDownload = async () => {
    const path = file?.path || file?.name;
    if (!path) return;

    startDownloadTransition(async () => {
      const { data, error } = await supabase.storage
        .from(bucketId)
        .download(path);

      if (error) {
        console.error("Error downloading file:", error);
        toast.error(`Failed to download file: ${error.message}`);
        return;
      }

      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = path.split("/").pop() || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("File downloaded successfully");
      }
    });
  };

  const handleCopyUrl = async () => {
    startCopyTransition(async () => {
      try {
        const url = await getFileUrl();
        if (!url) {
          toast.error("Failed to generate file URL");
          return;
        }

        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("File URL copied to clipboard");
      } catch (error) {
        console.error("Error copying URL:", error);
        toast.error(
          `Failed to copy URL: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full">
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div className="min-w-0 flex-1">
              <DrawerTitle className="truncate">{file.name}</DrawerTitle>
              <DrawerDescription>
                {formatFileSize(file.size)} • {file.type || "Unknown type"}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 space-y-4 p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                File Name
              </h3>
              <p className="text-sm break-all">{file.name}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Size
              </h3>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Type
              </h3>
              <p className="text-sm">{file.type || "Unknown"}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Last Modified
              </h3>
              <p className="text-sm">{formatDate(file.lastModified)}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Path
              </h3>
              <p className="bg-muted rounded p-2 font-mono text-sm text-xs break-all">
                {bucketId}/{file.path || file.name}
              </p>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleCopyUrl}
              disabled={isPendingCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </>
              )}
            </Button>
            <Button onClick={handleDownload} disabled={isPendingDownload}>
              <Download className="mr-2 h-4 w-4" />
              {isPendingDownload ? "Downloading..." : "Download"}
            </Button>
          </div>
          {(file.type?.startsWith("image/") ||
            file.type?.startsWith("video/") ||
            file.type?.startsWith("audio/") ||
            file.type?.includes("pdf") ||
            file.type?.includes("text")) && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={async () => {
                const url = await getFileUrl();
                window.open(url, "_blank");
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Browser
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
