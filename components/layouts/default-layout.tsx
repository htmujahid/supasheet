import { SidebarProvider } from "../ui/sidebar";

export async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  );
}
