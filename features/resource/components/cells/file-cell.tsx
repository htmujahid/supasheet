import { FileObject } from "../fields/types";
import { getFileIcon } from "../../lib/utils/files";

export function FileCell({ value }: { value: FileObject[] }) {
  const filesCount = value?.length;

  if (!filesCount) {
    return null;
  }

  return (
    <div className="flex flex-nowrap items-center gap-2">
      {
        value?.map((file, index) => {
          const Icon = getFileIcon(file.type);
          return (
            <div
              key={index}
              className="text-muted-foreground flex flex-nowrap items-center gap-1 text-sm"
            >
              <Icon className="size-4" />
              <span>{file.name}</span>
            </div>
          )
        })
      }
    </div>
  );
}
