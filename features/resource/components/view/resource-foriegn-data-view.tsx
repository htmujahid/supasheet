import type {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { loadResourcePermissions } from "../../lib/loaders";
import { ResourceContextProvider } from "../resource-context";
import { ResourceForeignTable } from "./resource-foreign-table";

type ResourceForeignDataViewProps = {
  relationship: TableSchema & { columns: ColumnSchema[] };
  data: ResourceDataSchema[] | null;
};

export async function ResourceForeignDataView({
  relationship,
  data,
}: ResourceForeignDataViewProps) {
  const permissions = await loadResourcePermissions(
    relationship.schema as never,
    relationship.name as never,
  );
  return (
    <ResourceContextProvider
      permissions={permissions}
      tableSchema={relationship}
      columnsSchema={relationship.columns}
    >
      <ResourceForeignTable relationship={relationship} data={data} />
    </ResourceContextProvider>
  );
}
