import { Metadata } from "next";

import { notFound } from "next/navigation";

import { StorageExplorer } from "@/interfaces/storage-explorer/components/storage-explorer";
import type { StorageFile } from "@/features/storage/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

type StorageBucketPageProps = {
  params: Promise<{
    bucket: string;
  }>;
  searchParams: Promise<{
    path?: string;
  }>;
};

export async function generateMetadata({
  params,
}: StorageBucketPageProps): Promise<Metadata> {
  const { bucket } = await params;

  return {
    title: `${bucket} - Storage`,
  };
}

async function StorageBucketPage({
  params,
  searchParams,
}: StorageBucketPageProps) {
  const { bucket: bucketId } = await params;
  const { path = "" } = await searchParams;

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from(bucketId)
    .list(path || undefined, {
      limit: 1000,
      offset: 0,
    });

  if (error) {
    notFound();
  }

  const files: StorageFile[] = (data || []).map((file) => ({
    id: file.id || file.name,
    name: file.name,
    size: file.metadata?.size,
    type: file.metadata?.mimetype,
    lastModified: file.updated_at ? new Date(file.updated_at) : undefined,
    isFolder: !file.id,
    path: path ? `${path}/${file.name}` : file.name,
  }));

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-grow p-4">
      <StorageExplorer bucketId={bucketId} files={files} currentPath={path} />
    </div>
  );
}

export default StorageBucketPage;
