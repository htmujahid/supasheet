export type StorageFile = {
  id: string;
  name: string;
  size?: number;
  type?: string;
  lastModified?: Date;
  isFolder?: boolean;
  path?: string;
};

export type StorageBucket = {
  id: string;
  name: string;
  public: boolean;
  created_at?: string;
  updated_at?: string;
  owner?: string;
  file_size_limit?: number | null;
  allowed_mime_types?: string[] | null;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type StorageExplorerContextType = {
  currentBucket: string;
  currentPath: string;
  files: StorageFile[];
  isLoading: boolean;
  selectedFiles: Set<string>;
  viewMode: "grid" | "list";
  sortBy: "name" | "size" | "modified";
  sortOrder: "asc" | "desc";
  searchQuery: string;
  setCurrentBucket: (bucket: string) => void;
  setCurrentPath: (path: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sortBy: "name" | "size" | "modified") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSearchQuery: (query: string) => void;
  toggleFileSelection: (fileId: string) => void;
  selectAllFiles: () => void;
  clearSelection: () => void;
  refreshFiles: () => Promise<void>;
};
