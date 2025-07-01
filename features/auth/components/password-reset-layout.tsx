import { Heading } from "@/components/ui/heading";

export function PasswordResetLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className={"flex flex-col gap-6"}>
      <div className="flex flex-col gap-2">
        <Heading level={2}>{title}</Heading>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}
