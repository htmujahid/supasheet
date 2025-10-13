"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  EditIcon,
  FileCode2Icon,
  PlusIcon,
  TerminalSquareIcon,
  TrashIcon,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SqlSnippetItemProps {
  item: { name: string; id: string };
  isActive: boolean;
  onUpdateItems: (updatedItems: { name: string; id: string }[]) => void;
  items: { name: string; id: string }[];
  activeItem: { name: string; id: string } | undefined;
}

function SqlSnippetItem({
  item,
  isActive,
  onUpdateItems,
  items,
  activeItem,
}: SqlSnippetItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(item.name);

  const handleRename = () => {
    setIsEditing(true);
    setEditingName(item.name);
  };

  const handleSaveRename = () => {
    if (!editingName.trim()) return;

    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, name: editingName.trim() } : i,
    );

    onUpdateItems(updatedItems);
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setIsEditing(false);
    setEditingName(item.name);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  const handleRemove = () => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    onUpdateItems(updatedItems);

    // If the removed item was active, navigate to the first available item or home
    if (activeItem?.id === item.id) {
      if (updatedItems.length > 0) {
        router.push(`/home/sql-editor/${updatedItems[0].id}`);
      } else {
        router.push("/home/sql-editor");
      }
    }
  };

  if (isEditing) {
    return (
      <div className="px-2 py-1">
        <Input
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={handleSaveRename}
          placeholder="Enter new name..."
          autoFocus
          className="h-8 text-sm"
        />
      </div>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={"/home/sql-editor/" + item.id} title={item.name}>
            <FileCode2Icon />
            <span>{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleRename}>
          <EditIcon className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleRemove}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function SqlSidebar() {
  const params = useParams();
  const router = useRouter();
  const [items = [], setItems] = useLocalStorage<
    {
      name: string;
      id: string;
    }[]
  >("sql-sidebar-items", []);
  const [isEditing, setIsEditing] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState("");

  const activeItem = items?.find((item) => item.id === params?.id);

  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  const handleUpdateItems = (updatedItems: { name: string; id: string }[]) => {
    setItems(updatedItems);
    setActiveItems(updatedItems);
  };

  const handleCreateSnippet = () => {
    if (!newSnippetName.trim()) return;

    const newSnippet = {
      name: newSnippetName.trim(),
      id: `${Date.now()}`,
    };

    const updatedItems = [...items, newSnippet];
    handleUpdateItems(updatedItems);
    setNewSnippetName("");
    setIsEditing(false);

    // Navigate to the new snippet
    router.push(`/home/sql-editor/${newSnippet.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSnippet();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewSnippetName("");
    }
  };

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 border-b p-2.5">
        <SidebarMenuButton className="w-fit px-1.5">
          <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <TerminalSquareIcon className="size-4" />
          </div>
          <span className="truncate font-medium">SQL Editor</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarInput
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveItems(
                items.filter((resource) =>
                  resource.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
                ),
              );
            }}
            placeholder="Type to search..."
          />
          <SidebarMenu className="mt-2 overflow-y-auto">
            {isEditing ? (
              <div className="px-2 py-1">
                <Input
                  value={newSnippetName}
                  onChange={(e) => setNewSnippetName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleCreateSnippet}
                  placeholder="Enter snippet name..."
                  autoFocus
                  className="h-8 text-sm"
                />
              </div>
            ) : (
              <SidebarMenuButton onClick={() => setIsEditing(true)}>
                <PlusIcon />
                <span>Create Snippet</span>
              </SidebarMenuButton>
            )}
            {activeItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SqlSnippetItem
                  item={item}
                  isActive={activeItem?.id === item.id}
                  onUpdateItems={handleUpdateItems}
                  items={items}
                  activeItem={activeItem}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
