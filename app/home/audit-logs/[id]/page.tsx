import Link from "next/link";

import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Our audit logs system is under development
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/home">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
