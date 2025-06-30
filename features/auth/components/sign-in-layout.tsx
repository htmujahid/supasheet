import { Heading } from "@/components/ui/heading";

export function SignInLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="">
        <Heading level={2}>{title}</Heading>
        <p className="text-muted-foreground text-sm text-balance">{description}</p>
      </div>
      {children}
    </div>
  );
}
