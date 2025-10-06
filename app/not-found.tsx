import Link from "next/link";

import { ArrowLeft, FileQuestionIcon } from "lucide-react";

import { Trans } from "@/components/makerkit/trans";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { createI18nServerInstance } from "@/lib/i18n/i18n.server";
import { withI18n } from "@/lib/i18n/with-i18n";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t("common:notFound");

  return {
    title,
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
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
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
};

export default withI18n(NotFoundPage);
