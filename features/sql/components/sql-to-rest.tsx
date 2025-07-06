import { useCallback, useRef } from "react";

import dynamic from "next/dynamic";

import { Monaco } from "@monaco-editor/react";
import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { IStandaloneCodeEditor } from "../lib/types";
import { useSqlData } from "../lib/use-sql-data";

const MonacoEditor = dynamic(() => import("./monaco-editor"), { ssr: false });

export default function SqlToRest() {
  const sqlData = useSqlData();

  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const id = "1";

  const executeQuery = useCallback(async () => {
    const value = editorRef.current?.getValue() || "";
    await sqlData(value);
  }, [sqlData]);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="text-base font-medium">SQL Editor</div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => executeQuery()}>
            <PlayIcon className="size-4" />
            Execute
          </Button>
        </div>
      </div>
      <div className="mt-2.5 h-[calc(20vh)] w-full overflow-hidden rounded-md border">
        <MonacoEditor
          id={id}
          editorRef={editorRef}
          monacoRef={monacoRef}
          executeQuery={executeQuery}
        />
      </div>
    </>
  );
}
