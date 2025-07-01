import { ResourceTable } from "@/features/resources/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "@/features/resources/lib/loaders";
import { searchParamsCache } from "@/features/resources/lib/validations";
import { DatabaseTables } from "@/lib/database-meta.types";

export default async function HomeResourcePage(props: {
  params: Promise<{
    id: DatabaseTables;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const table = await loadTableSchema(id);

  const columns = await loadColumnsSchema(id);

  const data = await loadResourceData(id, columns ?? [], search);

  return (
    <ResourceTable
      tableSchema={table ?? null}
      columnsSchema={columns ?? []}
      data={data}
    />
  );
}
