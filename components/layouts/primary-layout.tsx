import { Sidebar } from "../ui/sidebar";
import { PrimarySidebar } from "./primary-sidebar";

export function PrimaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! overflow-hidden *:data-[sidebar=sidebar]:flex-row"
    >
      <PrimarySidebar />
      {children}
    </Sidebar>
  );
}
