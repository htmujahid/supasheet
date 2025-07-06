import { MutableRefObject, useCallback, useRef } from "react";

import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { debounce } from "lodash";
import { useTheme } from "next-themes";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

import type { IStandaloneCodeEditor } from "../lib/types";

export type MonacoEditorProps = {
  id: string;
  className?: string;
  editorRef: MutableRefObject<IStandaloneCodeEditor | null>;
  monacoRef: MutableRefObject<Monaco | null>;
  autoFocus?: boolean;
  executeQuery: () => void;
  onMount?: (editor: IStandaloneCodeEditor) => void;
};

const intellisenseEnabled = true; // This can be replaced with a hook or prop to toggle intellisense

export default function MonacoEditor({
  id,
  editorRef,
  monacoRef,
  autoFocus = true,
  className,
  executeQuery,
  onMount,
}: MonacoEditorProps) {
  const { resolvedTheme } = useTheme();

  const [content, setContent] = useLocalStorage<string | undefined>(
    `sql-editor-content-${id}`,
    undefined,
  );

  const executeQueryRef = useRef(executeQuery);
  executeQueryRef.current = executeQuery;

  // Create a debounced version of setContent to avoid excessive localStorage writes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetContent = useCallback(
    debounce((value: string | undefined) => {
      setContent(value);
    }, 500), // 500ms delay
    [setContent],
  );

  const handleEditorOnMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const model = editorRef.current.getModel();
    if (model !== null) {
      monacoRef.current.editor.setModelMarkers(model, "owner", []);
    }

    editor.addAction({
      id: "run-query",
      label: "Run Query",
      keybindings: [monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter],
      contextMenuGroupId: "operation",
      contextMenuOrder: 0,
      run: () => {
        executeQueryRef.current();
      },
    });

    if (autoFocus) {
      if (editor.getValue().length === 1)
        editor.setPosition({ lineNumber: 1, column: 2 });
      editor.focus();
    }

    onMount?.(editor);
  };

  function handleEditorChange(value: string | undefined) {
    debouncedSetContent(value);
  }

  return (
    <Editor
      className={cn(className, "monaco-editor")}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      onMount={handleEditorOnMount}
      onChange={handleEditorChange}
      defaultLanguage="pgsql"
      defaultValue={content}
      path={id}
      options={{
        tabSize: 2,
        fontSize: 13,
        lineDecorationsWidth: 0,
        minimap: { enabled: false },
        wordWrap: "on",
        padding: { top: 4 },
        suggest: {
          showMethods: intellisenseEnabled,
          showFunctions: intellisenseEnabled,
          showConstructors: intellisenseEnabled,
          showDeprecated: intellisenseEnabled,
          showFields: intellisenseEnabled,
          showVariables: intellisenseEnabled,
          showClasses: intellisenseEnabled,
          showStructs: intellisenseEnabled,
          showInterfaces: intellisenseEnabled,
          showModules: intellisenseEnabled,
          showProperties: intellisenseEnabled,
          showEvents: intellisenseEnabled,
          showOperators: intellisenseEnabled,
          showUnits: intellisenseEnabled,
          showValues: intellisenseEnabled,
          showConstants: intellisenseEnabled,
          showEnums: intellisenseEnabled,
          showEnumMembers: intellisenseEnabled,
          showKeywords: intellisenseEnabled,
          showWords: intellisenseEnabled,
          showColors: intellisenseEnabled,
          showFiles: intellisenseEnabled,
          showReferences: intellisenseEnabled,
          showFolders: intellisenseEnabled,
          showTypeParameters: intellisenseEnabled,
          showIssues: intellisenseEnabled,
          showUsers: intellisenseEnabled,
          showSnippets: intellisenseEnabled,
        },
      }}
    />
  );
}
