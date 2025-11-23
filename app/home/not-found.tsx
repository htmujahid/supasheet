import Link from "next/link";

import { FileQuestionIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const generateMetadata = async () => {
  return {
    title: "Not Found",
  };
};

async function NotFoundPage() {
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
              <FileQuestionIcon />
            </EmptyMedia>
            <EmptyTitle>404 - Page Not Found</EmptyTitle>
            <EmptyDescription>
              The page you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}

export default NotFoundPage;
