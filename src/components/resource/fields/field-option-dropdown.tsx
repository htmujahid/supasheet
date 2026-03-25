import { SquarePenIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { ButtonGroup } from "#/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { ColumnMetadata } from "#/types/fields"

export function FieldOptionDropdown({
  columnMetadata,
  setValue,
  children,
}: {
  columnMetadata: ColumnMetadata
  setValue: (value: string | null | undefined) => void
  children?: React.ReactNode
}) {
  if (!children && columnMetadata.required && !columnMetadata.defaultValue) {
    return null
  }

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size={"icon"} className="">
            <SquarePenIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {!columnMetadata.required && (
            <DropdownMenuItem
              onClick={() => {
                setValue(null)
              }}
            >
              Set Null
            </DropdownMenuItem>
          )}
          {columnMetadata.defaultValue && (
            <DropdownMenuItem
              onClick={() => {
                setValue("")
              }}
            >
              Set Default
            </DropdownMenuItem>
          )}
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
