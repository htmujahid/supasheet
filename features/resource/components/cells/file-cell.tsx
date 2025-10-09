import { FileIcon, ImageIcon, MusicIcon, VideoIcon } from "lucide-react";

export function FileCell({
  value
}: {
  value: string[]
}) {
  const filesCount = value?.length;

  if (!filesCount) { return null; }

  const files = value.reduce((acc, file) => {
    const type = getFileType(file);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex items-center gap-2 flex-nowrap">
      {files.images > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-nowrap">
          <ImageIcon className="size-4" />
              <span>{files.images}</span>
            </div>
          )}
          {files.videos > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground flex-nowrap">
              <VideoIcon className="size-4" />
              <span>{files.videos}</span>
            </div>
          )}
          {files.audios > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground flex-nowrap">
              <MusicIcon className="size-4" />
              <span>{files.audios}</span>
            </div>
          )}
          {files.documents > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground flex-nowrap">
              <FileIcon className="size-4" />
              <span>{files.documents}</span>
            </div>
          )}
        </div>
  );
}

function getFileType(fileUrl: string) {
  const extension = fileUrl.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'documents';
  }

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg'];

  if (imageExtensions.includes(extension)) {
    return 'images';
  } else if (videoExtensions.includes(extension)) {
    return 'videos';
  } else if (audioExtensions.includes(extension)) {
    return 'audios';
  } else {
    return 'documents';
  }
}
