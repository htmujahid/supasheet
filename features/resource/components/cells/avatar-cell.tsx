import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function AvatarCell({ value }: { value: string | null }) {
  return (
    <Avatar className="size-5.5">
      <AvatarImage
        alt="Avatar"
        src={value ? value.toString() : undefined}
      />
      <AvatarFallback>
        <User className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}
