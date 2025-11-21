import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileObject } from "../fields/types";

export function AvatarCell({ value }: { value: FileObject | null }) {
  return (
    <Avatar className="size-5.5">
      <AvatarImage alt="Avatar" src={value ? value.url : undefined} />
      <AvatarFallback>
        <User className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}
