import { Suspense } from "react";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { UsersTable } from "@/features/users/components/user-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "@/features/users/lib/loaders";
import { searchParamsCache } from "@/features/users/lib/validations";

export default async function HomeRolePermissionsPage(props: {
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const promises = Promise.all([
    loadTableSchema("role_permissions"),
    loadColumnsSchema("role_permissions"),
    loadResourceData("role_permissions", search),
  ]);

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={7}
          rowCount={100}
          filterCount={2}
          cellWidths={[
            "64px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
          ]}
          shrinkZero
        />
      }
    >
      <UsersTable promises={promises} />
    </Suspense>
  );
}
