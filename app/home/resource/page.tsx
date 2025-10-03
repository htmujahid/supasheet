import { FileText } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcesPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Alert className="max-w-md">
        <FileText className="h-4 w-4" />
        <AlertTitle>No Resource Selected</AlertTitle>
        <AlertDescription>
          Please select a table from the sidebar to view its contents or create
          a new record.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default withI18n(HomeResourcesPage);
