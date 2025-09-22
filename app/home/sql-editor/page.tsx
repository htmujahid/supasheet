import { FileText } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

export default function SqlPage() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:!h-4"
          />
          <AppBreadcrumbs />
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
        <Alert className="max-w-md">
          <FileText className="h-4 w-4" />
          <AlertTitle>No SQL Snippet Selected</AlertTitle>
          <AlertDescription>
            Please select a SQL from the sidebar to view its contents or create a
            new SQL.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
