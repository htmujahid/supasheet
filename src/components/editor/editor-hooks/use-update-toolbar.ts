import { useEffect, useRef } from "react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import {
  $getSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import type { BaseSelection } from "lexical"

export function useUpdateToolbarHandler(
  callback: (selection: BaseSelection) => void
) {
  const { activeEditor } = useToolbarContext()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if (selection) {
          callbackRef.current(selection)
        }
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [activeEditor])

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      const selection = $getSelection()
      if (selection) {
        callbackRef.current(selection)
      }
    })
  }, [activeEditor])
}
