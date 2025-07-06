"use client";

import { SqlProvider } from "./sql-context";
import { SqlTable } from "./sql-table";
import SqlToRestWithFallback from "./sql-to-rest-fallback";

export function SQL() {
  return (
    <SqlProvider>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-md border-b">
          <SqlToRestWithFallback />
        </div>
        <SqlTable />
      </div>
    </SqlProvider>
  );
}
