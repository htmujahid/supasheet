"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TRANSFORMERS,
} from "@lexical/markdown"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { editorTheme } from "#/components/editor/themes/editor-theme"
import { HR } from "#/components/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "#/components/editor/transformers/markdown-image-transformer"
import { TABLE } from "#/components/editor/transformers/markdown-table-transformer"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"

export function Editor({
  name,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  name?: string
  value: string
  onChange?: (editorState: string) => void
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg bg-background ${!disabled && "border"}`}
    >
      <LexicalComposer
        initialConfig={{
          nodes,
          theme: editorTheme,
          editable: !disabled,
          namespace: name ?? "EditorMD",
          editorState: () =>
            $convertFromMarkdownString(value, [
              TABLE,
              HR,
              IMAGE,
              CHECK_LIST,
              ...ELEMENT_TRANSFORMERS,
              ...MULTILINE_ELEMENT_TRANSFORMERS,
              ...TEXT_FORMAT_TRANSFORMERS,
              ...TEXT_MATCH_TRANSFORMERS,
              ...TRANSFORMERS,
            ]),
          onError: (error: Error) => {
            console.error(error)
          },
        }}
      >
        <TooltipProvider>
          <Plugins disabled={disabled} placeholder={placeholder} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={async (editorState) => {
              editorState.read(() => {
                const markdown = $convertToMarkdownString([
                  TABLE,
                  HR,
                  IMAGE,
                  CHECK_LIST,
                  ...ELEMENT_TRANSFORMERS,
                  ...MULTILINE_ELEMENT_TRANSFORMERS,
                  ...TEXT_FORMAT_TRANSFORMERS,
                  ...TEXT_MATCH_TRANSFORMERS,
                  ...TRANSFORMERS,
                ])
                onChange?.(markdown)
              })
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
