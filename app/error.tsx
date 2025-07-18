"use client";

import { ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/layouts/site-header";
import { Trans } from "@/components/makerkit/trans";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

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
      <SiteHeader user={null} />

      <div
        className={
          "container m-auto flex w-full flex-1 flex-col items-center justify-center"
        }
      >
        <div className={"flex flex-col items-center space-y-8"}>
          <div>
            <h1 className={"font-heading text-9xl font-semibold"}>
              <Trans i18nKey={"common:errorPageHeading"} />
            </h1>
          </div>

          <div className={"flex flex-col items-center space-y-8"}>
            <div
              className={
                "flex max-w-xl flex-col items-center space-y-1 text-center"
              }
            >
              <div>
                <Heading level={2}>
                  <Trans i18nKey={"common:genericError"} />
                </Heading>
              </div>

              <p className={"text-muted-foreground text-lg"}>
                <Trans i18nKey={"common:genericErrorSubHeading"} />
              </p>
            </div>

            <div className={"flex space-x-4"}>
              <Button className={"w-full"} variant={"default"} onClick={reset}>
                <ArrowLeft className={"mr-2 h-4"} />

                <Trans i18nKey={"common:goBack"} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
