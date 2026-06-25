import { useMemo, useState } from "react"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { CodeActionMenuPlugin } from "@/components/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin"
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin"
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/plugins/floating-text-format-plugin"
import { AlignmentPickerPlugin } from "@/components/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/components/editor/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/components/editor/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/components/editor/plugins/picker/code-picker-plugin"
import { DividerPickerPlugin } from "@/components/editor/plugins/picker/divider-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/components/editor/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/editor/plugins/picker/numbered-list-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/picker/paragraph-picker-plugin"
import { QuotePickerPlugin } from "@/components/editor/plugins/picker/quote-picker-plugin"
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/components/editor/plugins/picker/table-picker-plugin"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/components/editor/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { CodeLanguageToolbarPlugin } from "@/components/editor/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { HR } from "@/components/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "@/components/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/components/editor/transformers/markdown-table-transformer"
import { validateUrl } from "@/components/editor/utils/url"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import {
  AutoFocusExtension,
  ClearEditorExtension,
  DecoratorTextExtension,
  HorizontalRuleExtension,
  SelectionAlwaysOnDisplayExtension,
} from "@lexical/extension"
import {
  AutoLinkExtension,
  ClickableLinkExtension,
  LinkExtension,
} from "@lexical/link"
import { CheckListExtension, ListExtension } from "@lexical/list"
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
import { OverflowNode } from "@lexical/overflow"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { RichTextExtension } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { configExtension, defineExtension } from "lexical"

import { ImagesExtension } from "./extensions/images-extension"
import { MarkdownShortcutsExtension } from "./extensions/markdown-shortcuts-extension"
import { MaxLengthExtension } from "./extensions/max-length-extension"
import { HorizontalRuleToolbarPlugin } from "./plugins/toolbar/horizontal-rule-toolbar-plugin"
import { ImageToolbarPlugin } from "./plugins/toolbar/image-toolbar-plugin"
import { TableToolbarPlugin } from "./plugins/toolbar/table-toolbar-plugin"

const defaultPlaceholder = "Press / for commands..."

const markdownTransformers = [
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

export function Editor({
  name,
  value,
  onChange,
  disabled,
  placeholder = defaultPlaceholder,
  maxLength = 10000,
}: {
  name?: string
  value: string
  onChange?: (editorState: string) => void
  disabled?: boolean
  placeholder?: string
  maxLength?: number
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  const AppExtension = useMemo(
    () =>
      defineExtension({
        dependencies: [
          RichTextExtension,
          ImagesExtension,
          AutoFocusExtension,
          SelectionAlwaysOnDisplayExtension,
          configExtension(LinkExtension, {
            validateUrl,
            attributes: { rel: "noopener noreferrer", target: "_blank" },
          }),
          AutoLinkExtension,
          ClickableLinkExtension,
          configExtension(MaxLengthExtension, { disabled: false, maxLength }),
          configExtension(MarkdownShortcutsExtension, {
            transformers: markdownTransformers,
          }),
          ClearEditorExtension,
          DecoratorTextExtension,
          configExtension(ListExtension, { shouldPreserveNumbering: false }),
          CheckListExtension,
          HorizontalRuleExtension,
        ],
        name: "@shadcn-editor",
        namespace: name ?? "EditorMD",
        editable: !disabled,
        nodes: [
          OverflowNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
        ],
        $initialEditorState() {
          $convertFromMarkdownString(value, markdownTransformers)
        },
        theme: editorTheme,
      }),
    [name, disabled]
  )

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow w-full">
      <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
        <TooltipProvider>
          <div className="relative">
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={["h1", "h2", "h3"]} />
                    <FormatNumberedList />
                    <FormatBulletedList />
                    <FormatCheckList />
                    <FormatCodeBlock />
                    <FormatQuote />
                  </BlockFormatDropDown>
                  {blockType === "code" ? (
                    <CodeLanguageToolbarPlugin />
                  ) : (
                    <>
                      <Separator
                        orientation="vertical"
                        className="h-6 my-auto"
                      />
                      <ElementFormatToolbarPlugin separator={false} />
                      <Separator
                        orientation="vertical"
                        className="h-6 my-auto"
                      />
                      <FontFormatToolbarPlugin />
                      <Separator
                        orientation="vertical"
                        className="h-6 my-auto"
                      />
                      <LinkToolbarPlugin
                        setIsLinkEditMode={setIsLinkEditMode}
                      />
                      <Separator
                        orientation="vertical"
                        className="h-6 my-auto"
                      />
                      <HorizontalRuleToolbarPlugin />
                      <ImageToolbarPlugin />
                      <TableToolbarPlugin />
                    </>
                  )}
                </div>
              )}
            </ToolbarPlugin>
            <div className="relative">
              <div className="">
                <div className="" ref={onRef}>
                  <ContentEditable
                    placeholder={placeholder}
                    className="h-[calc(100vh-141px)] pl-4"
                  />
                </div>
              </div>
              <ComponentPickerMenuPlugin
                baseOptions={[
                  ParagraphPickerPlugin(),
                  HeadingPickerPlugin({ n: 1 }),
                  HeadingPickerPlugin({ n: 2 }),
                  HeadingPickerPlugin({ n: 3 }),
                  TablePickerPlugin(),
                  CheckListPickerPlugin(),
                  NumberedListPickerPlugin(),
                  BulletedListPickerPlugin(),
                  QuotePickerPlugin(),
                  CodePickerPlugin(),
                  DividerPickerPlugin(),
                  ImagePickerPlugin(),
                  AlignmentPickerPlugin({ alignment: "left" }),
                  AlignmentPickerPlugin({ alignment: "center" }),
                  AlignmentPickerPlugin({ alignment: "right" }),
                  AlignmentPickerPlugin({ alignment: "justify" }),
                ]}
                dynamicOptionsFn={DynamicTablePickerPlugin}
              />
              <TabIndentationPlugin />
              <CodeHighlightPlugin />
              <TablePlugin />
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
              <FloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            </div>
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              editorState.read(() => {
                onChange?.($convertToMarkdownString(markdownTransformers))
              })
            }}
          />
        </TooltipProvider>
      </LexicalExtensionComposer>
    </div>
  )
}
