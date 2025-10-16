"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { $convertFromMarkdownString, $convertToMarkdownString, CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS, TRANSFORMERS } from '@lexical/markdown';

import { TooltipProvider } from "@/components/ui/tooltip"

import { editorTheme } from "@/interfaces/rich-text-editor/themes/editor-theme"
import { TABLE } from "@/interfaces/rich-text-editor/transformers/markdown-table-transformer";
import { HR } from "@/interfaces/rich-text-editor/transformers/markdown-hr-transformer";
import { IMAGE } from "@/interfaces/rich-text-editor/transformers/markdown-image-transformer";

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
    <div className="bg-background overflow-hidden rounded-lg border w-full">
      <LexicalComposer
        initialConfig={{
          nodes,
          theme: editorTheme,
          editable: !disabled,
          namespace: name ?? "EditorMD",
          editorState: () => $convertFromMarkdownString(value, [
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
                const markdown = $convertToMarkdownString(
                  [
                    TABLE,
                    HR,
                    IMAGE,
                    CHECK_LIST,
                    ...ELEMENT_TRANSFORMERS,
                    ...MULTILINE_ELEMENT_TRANSFORMERS,
                    ...TEXT_FORMAT_TRANSFORMERS,
                    ...TEXT_MATCH_TRANSFORMERS,
                    ...TRANSFORMERS,
                  ]
                );
                onChange?.(markdown);
              })
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
