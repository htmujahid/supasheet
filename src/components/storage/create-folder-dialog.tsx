import { useState } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { FolderPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { storageCreateFolderMutationOptions } from "#/lib/supabase/data/storage"

interface CreateFolderDialogProps {
  bucketId: string
  path: string[]
}

export function CreateFolderDialog({
  bucketId,
  path,
}: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const queryClient = useQueryClient()

  const { mutateAsync: createFolder, isPending } = useMutation(
    storageCreateFolderMutationOptions
  )

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const folderPath = [...path, trimmed].join("/")
    try {
      await createFolder({ bucketId, folderPath })
      await queryClient.invalidateQueries({
        queryKey: ["storage", "files", bucketId],
      })
      toast.success(`Folder "${trimmed}" created`)
      setName("")
      setOpen(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create folder"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <FolderPlusIcon className="mr-1.5 size-3.5" />
            New Folder
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="folder-name">Folder name</Label>
          <Input
            id="folder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-folder"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate()
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
