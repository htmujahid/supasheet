import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

import type { FileMetadata } from "@/hooks/use-file-upload";

type FileFieldIconProps = {
  file: { file: File | FileMetadata };
};

export function FileFieldIcon({ file }: FileFieldIconProps) {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (fileType.startsWith("image/"))
    return <ImageIcon className="size-5 opacity-60" />;
  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.match(/\.docx?$/)
  )
    return <FileTextIcon className="size-5 opacity-60" />;
  if (fileType.includes("video/"))
    return <VideoIcon className="size-5 opacity-60" />;
  if (fileType.includes("audio/"))
    return <HeadphonesIcon className="size-5 opacity-60" />;
  if (fileType.includes("excel") || fileName.match(/\.xlsx?$/))
    return <FileSpreadsheetIcon className="size-5 opacity-60" />;
  if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.match(/\.(zip|rar)$/)
  )
    return <FileArchiveIcon className="size-5 opacity-60" />;

  return <FileIcon className="size-5 opacity-60" />;
}
