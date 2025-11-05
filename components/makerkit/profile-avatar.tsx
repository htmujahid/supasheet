import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SessionProps = {
  displayName: string | null;
  pictureUrl?: string | null;
};

type TextProps = {
  text: string;
};

type ProfileAvatarProps = (SessionProps | TextProps) & {
  className?: string;
  fallbackClassName?: string;
};

export function ProfileAvatar(props: ProfileAvatarProps) {
  const avatarClassName = cn(
    props.className,
    "mx-auto h-8 w-8 group-focus:ring-2",
  );

  if ("text" in props) {
    const { text, fallbackClassName } = props;
    return (
      <Avatar className={avatarClassName}>
        <AvatarFallback
          className={cn(fallbackClassName, "animate-in fade-in uppercase")}
        >
          {text.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
    );
  }

  const { displayName, pictureUrl, fallbackClassName } = props;
  const initials = displayName?.slice(0, 1);

  return (
    <Avatar className={avatarClassName}>
      <AvatarImage src={pictureUrl ?? undefined} />

      <AvatarFallback className={cn(fallbackClassName, "animate-in fade-in")}>
        <span suppressHydrationWarning className={"uppercase"}>
          {initials}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
