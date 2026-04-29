import { EllipsisIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
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
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "icon" })}>
          <EllipsisIcon size={16} aria-hidden="true" />
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
