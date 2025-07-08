import { FileText } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function HomeUsersPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Alert className="max-w-md">
        <FileText className="h-4 w-4" />
        <AlertTitle>No User Selected</AlertTitle>
        <AlertDescription>
          Please select a user from the sidebar to view its contents or create a
          new user.
        </AlertDescription>
      </Alert>
    </div>
  );
}
