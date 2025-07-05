import { SquarePenIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ViewPage() {
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-base font-medium">View Tasks</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <SquarePenIcon className="size-4" />
              Edit Task
            </Button>
            <Button variant="destructive" size="sm">
              <TrashIcon className="size-4" />
              Delete Task
            </Button>
          </div>
        </div>
        <div className="h-[1024px] overflow-hidden rounded-md border">
          <div></div>
        </div>
      </div>
    </>
  );
}
