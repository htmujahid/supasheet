"use client";

import { type ReactNode, createContext, useContext } from "react";

type ResourcePermissions = {
  canSelect: boolean;
  canInsert: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

const ResourceContext = createContext<{ permissions: ResourcePermissions }>({
  permissions: {
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false,
  }
});

export function ResourceContextProvider({
  children,
  permissions
}: {
  children: ReactNode;
  permissions: ResourcePermissions;
}) {
  return (
    <ResourceContext.Provider value={{ permissions }}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResourceContext() {
  return useContext(ResourceContext);
}
