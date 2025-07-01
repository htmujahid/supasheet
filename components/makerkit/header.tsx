import { cn } from "@/lib/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = function ({
  className,
  logo,
  navigation,
  actions,
  ...props
}) {
  return (
    <div
      className={cn(
        "site-header bg-sidebar sticky top-0 z-20 w-full border-b py-1 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="px-4 md:px-6">
        <div className="grid h-12 grid-cols-3 items-center">
          <div className={"mx-auto md:mx-0"}>{logo}</div>
          <div className="order-first md:order-none">{navigation}</div>
          <div className="flex items-center justify-end gap-x-2">{actions}</div>
        </div>
      </div>
    </div>
  );
};
