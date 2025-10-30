"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowUpRight,
  Code2Icon,
  EditIcon,
  MoreHorizontal,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface EditorItemProps {
  item: { name: string; id: string };
  isActive: boolean;
  onUpdateItems: (updatedItems: { name: string; id: string }[]) => void;
  items: { name: string; id: string }[];
  activeItem: { name: string; id: string } | undefined;
  activeSchema?: string;
  isMobile: boolean;
}

function EditorItem({
  item,
  isActive,
  onUpdateItems,
  items,
  activeItem,
  activeSchema,
  isMobile,
}: EditorItemProps) {
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
        router.push(`/home/${activeSchema}/sql-editor/${updatedItems[0].id}`);
      } else {
        router.push(`/home/${activeSchema}`);
      }
    }
  };

  const handleOpenInNewTab = () => {
    window.open(`/home/${activeSchema}/sql-editor/${item.id}`, "_blank");
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
    <>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={`/home/${activeSchema}/sql-editor/${item.id}`}
          title={item.name}
        >
          <Code2Icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem onClick={handleRename}>
            <EditIcon className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenInNewTab}>
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleRemove}>
            <TrashIcon className="text-muted-foreground" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function NavResourceEditor({ activeSchema }: { activeSchema?: string }) {
  const params = useParams<{ snippet: string }>();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [items = [], setItems] = useLocalStorage<
    {
      name: string;
      id: string;
    }[]
  >(`sql-editor-items-${activeSchema}`, []);
  const [isEditing, setIsEditing] = useState(false);
  const [newEditorName, setNewEditorName] = useState("");

  const activeItem = items?.find((item) => item.id === params?.snippet);

  const handleUpdateItems = (updatedItems: { name: string; id: string }[]) => {
    setItems(updatedItems);
  };

  const handleCreateEditor = () => {
    if (!newEditorName.trim()) {
      setIsEditing(false);
      return;
    }

    const newEditor = {
      name: newEditorName.trim(),
      id: `${Date.now()}`,
    };

    const updatedItems = [...items, newEditor];
    handleUpdateItems(updatedItems);
    setNewEditorName("");
    setIsEditing(false);

    // Navigate to the new editor
    router.push(`/home/${activeSchema}/sql-editor/${newEditor.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateEditor();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewEditorName("");
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>SQL Editors</SidebarGroupLabel>
      <SidebarMenu>
        {isEditing ? (
          <div className="px-2 py-1">
            <Input
              value={newEditorName}
              onChange={(e) => setNewEditorName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleCreateEditor}
              placeholder="Enter editor name..."
              autoFocus
              className="h-8 text-sm"
            />
          </div>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={() => setIsEditing(true)}
            >
              <PlusIcon />
              <span>Create Editor</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {items.map((item) => (
          <SidebarMenuItem key={item.id}>
            <EditorItem
              item={item}
              isActive={activeItem?.id === item.id}
              onUpdateItems={handleUpdateItems}
              items={items}
              activeItem={activeItem}
              activeSchema={activeSchema}
              isMobile={isMobile}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
