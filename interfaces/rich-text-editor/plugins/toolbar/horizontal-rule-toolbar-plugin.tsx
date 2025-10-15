"use client"

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode"
import { ScissorsIcon } from "lucide-react"

import { useToolbarContext } from "@/interfaces/rich-text-editor/context/toolbar-context"
import { Button } from "@/components/ui/button"

export function HorizontalRuleToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  return (
    <Button
      onClick={() =>
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }
      size={"icon-sm"}
      variant={"outline"}
      type="button"
      className=""
    >
      <ScissorsIcon className="size-4" />
    </Button>
  )
}
