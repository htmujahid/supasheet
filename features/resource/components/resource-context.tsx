"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

import { If } from "@/components/makerkit/if";
import { ColumnSchema, TableSchema } from "@/lib/database-meta.types";

import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceDetailSheet } from "./resource-detail-sheet";
import { ResourceSheet } from "./resource-sheet";

type ResourcePermissions = {
  canSelect: boolean;
  canInsert: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

type ResourceAction =
  | {
      variant: "update" | "view" | "delete";
      data: Record<string, unknown>;
    }
  | {
      variant: "create";
      data?: Record<string, unknown>;
    };

const ResourceContext = createContext<{
  permissions: ResourcePermissions;
  resourceAction: ResourceAction | null;
  setResourceAction: React.Dispatch<
    React.SetStateAction<ResourceAction | null>
  >;
}>({
  permissions: {
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false,
  },
  resourceAction: null,
  setResourceAction: () => {},
});

export function ResourceContextProvider({
  children,
  permissions,
  tableSchema,
  columnsSchema,
}: {
  children: ReactNode;
  permissions: ResourcePermissions;
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[] | null;
}) {
  const [resourceAction, setResourceAction] = useState<ResourceAction | null>(
    null,
  );

  return (
    <ResourceContext.Provider
      value={{ permissions, resourceAction, setResourceAction }}
    >
      {children}
      <If
        condition={
          resourceAction?.variant === "delete" &&
          tableSchema &&
          permissions.canDelete
        }
      >
        <DeleteResourceDialog
          open={resourceAction?.variant === "delete"}
          onOpenChange={() => setResourceAction(null)}
          resources={resourceAction?.data ? [resourceAction?.data] : []}
          tableSchema={tableSchema ?? null}
          columnSchema={columnsSchema ?? []}
          showTrigger={false}
        />
      </If>
      <If
        condition={
          resourceAction?.variant === "update" &&
          tableSchema &&
          permissions.canUpdate
        }
      >
        <ResourceSheet
          open={resourceAction?.variant === "update"}
          onOpenChange={() => setResourceAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={resourceAction?.data ?? null}
          create={false}
        />
      </If>
      <If
        condition={
          resourceAction?.variant === "create" &&
          tableSchema &&
          permissions.canInsert
        }
      >
        <ResourceSheet
          open={resourceAction?.variant === "create"}
          onOpenChange={() => setResourceAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={resourceAction?.data ?? null}
          create={true}
        />
      </If>
      <If
        condition={
          resourceAction?.variant === "view" &&
          tableSchema &&
          permissions.canSelect
        }
      >
        <ResourceDetailSheet
          open={resourceAction?.variant === "view"}
          onOpenChange={() => setResourceAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={resourceAction?.data ?? null}
        />
      </If>
    </ResourceContext.Provider>
  );
}

export function useResourceContext() {
  return useContext(ResourceContext);
}
