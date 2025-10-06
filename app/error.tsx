"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  console.error(error);

  return (
    <div className={"flex h-screen flex-1 flex-col"}>
      <div
        className={
          "container m-auto flex w-full flex-1 flex-col items-center justify-center"
        }
      >
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangleIcon />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={reset}>Try Again</Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
};

export default ErrorPage;
