"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { FileCode2Icon, PlusIcon } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function SqlSidebar() {
  const params = useParams();
  const router = useRouter();
  const [items = [], setItems] = useLocalStorage<{
    name: string;
    id: string;
  }[]>("sql-sidebar-items", []);
  const [isEditing, setIsEditing] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState("");

  const activeItem = items?.find((item) => item.id === params?.id);

  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  const handleCreateSnippet = () => {
    if (!newSnippetName.trim()) return;
    
    const newSnippet = {
      name: newSnippetName.trim(),
      id: `${Date.now()}`,
    };
    
    const updatedItems = [...items, newSnippet];
    setItems(updatedItems);
    setActiveItems(updatedItems);
    setNewSnippetName("");
    setIsEditing(false);
    
    // Navigate to the new snippet
    router.push(`/home/sql/${newSnippet.id}`);
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
        <div className="text-foreground text-base font-medium">Dashboard</div>
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
                  placeholder="Enter snippet name..."
                  autoFocus
                  className="h-8 text-sm"
                />
              </div>
            ) : (
              <SidebarMenuButton onClick={() => setIsEditing(true)}>
                <PlusIcon />
                <span>New Snippet</span>
              </SidebarMenuButton>
            )}
            {activeItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={activeItem?.id === item.id}
                >
                  <Link href={"/home/sql/" + item.id} title={item.name}>
                    <FileCode2Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
