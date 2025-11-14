import type {
  TableSchema,
  ColumnSchema,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

import { ResourceContextProvider } from "../resource-context";
import { ResourceForeignTable } from "./resource-foreign-table";
import { loadResourcePermissions } from "../../lib/loaders";


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
      <ResourceForeignTable
        relationship={relationship}
        data={data}
      />
    </ResourceContextProvider>
  );
}
