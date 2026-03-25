import type { LexicalEditor } from "lexical"

export function InsertLayoutDialog({
  activeEditor: _activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}) {
  onClose()
  return null
}
