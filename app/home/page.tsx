import { Metadata } from "next";

import { DatabaseIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DatabaseIcon />
        </EmptyMedia>
        <EmptyTitle>No tables found</EmptyTitle>
        <EmptyDescription>
          Please add some tables in your database. Follow the{" "}
          <a
            href="https://www.supasheet.app/docs/guide/quickstart"
            target="_blank"
            rel="noopener noreferrer"
          >
            quickstart guide
          </a>{" "}
          to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
