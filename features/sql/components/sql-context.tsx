import { createContext, useContext, useState } from "react";

import { TableSchema } from "@/lib/database-meta.types";

type SqlContextType = {
  data: TableSchema[];
  isLoading: boolean;
  setData: React.Dispatch<React.SetStateAction<TableSchema[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SqlContext = createContext<SqlContextType | null>(null);

export function SqlProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TableSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SqlContext.Provider value={{ data, isLoading, setData, setIsLoading }}>
      {children}
    </SqlContext.Provider>
  );
}

export function useSqlContext() {
  const context = useContext(SqlContext);
  if (!context) {
    throw new Error("useSqlContext must be used within a SqlProvider");
  }
  return context;
}
